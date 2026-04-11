import {StateGraph,StateSchema,type GraphNode ,START, END} from '@langchain/langgraph'
import z from 'zod'
import { cohereModel, geminiModel, mistralModel } from './model.ai.js'
import { createAgent, HumanMessage, providerStrategy ,tool } from 'langchain'
import { searchInternet } from '../services/internet.service.js'

const state = new StateSchema({
    problem: z.string().default(""),
    solution_1 : z.string().default(""),
    solution_2 : z.string().default(""),
    context: z.string().default(""),
    judge : z.object({
        solution_1_score : z.number().default(0),
        solution_2_score : z.number().default(0),
        solution_1_reason : z.string().default(""),
        solution_2_reason : z.string().default(""),
    })
})

const searchTool = tool(
    searchInternet,
    {
        name : "search_internet",
        description : "Search the internet for information related to a query",
        schema : z.object({
            query : z.string().describe("The search query")
        })
    }
)

const searchNode: GraphNode<typeof state> = async (state) => {
  try {
    const results = await searchInternet({ 
        query: state.problem 
    });

    // console.log("SEARCH RESULTS:", results)

    const context = results.results
      ?.map((r: any) => r.content)
      .join("\n\n");

    return {
      context: context || "",
    };
  } catch (error) {
    console.error("Search Error:", error);
    return {
      context: "",
    };
  }
};

const solutionNode : GraphNode<typeof state> = async(state)=>{

      const prompt = `
Use the following latest internet context to answer:

${state.context}

Question: ${state.problem}
`;

    const[mistralResponse , cohereResponse] = await Promise.all([
        mistralModel.invoke(prompt),
        cohereModel.invoke(prompt)
    ])

    return{
        solution_1 : mistralResponse.text,
        solution_2 : cohereResponse.text
    }
}



const judgeNode : GraphNode<typeof state> = async(state)=>{
    const{problem,solution_1,solution_2} = state

    const judge = createAgent({
        model: geminiModel,
        tools : [searchTool],
        responseFormat: providerStrategy(z.object({
            solution_1_score : z.number().min(0).max(10),
            solution_2_score : z.number().min(0).max(10),
            solution_1_reason : z.string(),
            solution_2_reason : z.string(),
        })),
        systemPrompt: `you are a judge that compares two solutions for a given problem and gives them a score between 0 and 10 based on their quality`
    })

    const judgeResponse = await judge.invoke({
        messages:[
            new HumanMessage(`
                Problem: ${problem}
                Solution 1: ${solution_1}
                Solution 2: ${solution_2}
                Please provide scores and reasons for both solutions.`)
        ]
    })

    const {solution_1_score,solution_2_score,solution_1_reason,solution_2_reason} = judgeResponse.structuredResponse

    return{
        judge : {
            solution_1_score,
            solution_2_score,
            solution_1_reason,
            solution_2_reason
        }
    }
}

const graph = new StateGraph(state)
        .addNode("search", searchNode)
     .addNode("solution",solutionNode)
     .addNode("judgeNode",judgeNode)
        
        .addEdge(START,"search")
        .addEdge("search","solution")
        .addEdge("solution","judgeNode")
        .addEdge("judgeNode",END)
        .compile()

        export  default async function (problem:string){
            const result = await graph.invoke({
                problem
            })

            return result
        }