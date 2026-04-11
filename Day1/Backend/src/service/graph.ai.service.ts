import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, ReducedValue, StateGraph, START, END } from "@langchain/langgraph";
import type { GraphNode } from "@langchain/langgraph";
import {z} from "zod";
import { mistralModel , cohereModel ,geminiModel } from "./model.service.js";
import { createAgent , providerStrategy } from "langchain";

const State = new StateSchema({
    messages: MessagesValue,
    solution_1: new ReducedValue(z.string().default(""),{
        reducer :(current,next)=>{
            return next
        }
    }),
    solution_2: new ReducedValue(z.string().default(""),{
        reducer :(current,next)=>{
            return next
        }
    }),

    judge_recomdetion: new ReducedValue(z.object().default({
            solution_1_score: 0,
            solution_2_score: 0,
    }),{
        reducer :(current,next)=>{
            return next
        }
 })

})

const solutionNode: GraphNode <typeof State> = async (state: typeof State) =>{

    console.log(state);

    const [mistralResponse, cohereResponse] = await Promise.all([
        mistralModel.invoke(state.messages[0].text),
        cohereModel.invoke(state.messages[0].text)
    ])

    

    return{
        solution_1: mistralResponse.text,
        solution_2: cohereResponse.text,
    }
    
}

const judgeNode: GraphNode <typeof State> = async (state: typeof State) =>{
    const{solution_1, solution_2} = state;

    const judge = createAgent({
        model: geminiModel,
        tools:[],
        responseFormat: providerStrategy(z.object({
            solution_1_score: z.number().min(0).max(10),
            solution_2_score: z.number().min(0).max(10),
        }))
    })

    const judgeResponse = await judge.invoke({
        messages :[
        new HumanMessage(
            `you are a judge between two solutions for the question : ${state.messages[0].text}. the first solution is : ${solution_1} and the second solution is : ${solution_2}. please score each solution between 0 to 10 based on their quality.`
        )
    ]
    })

    const result = judgeResponse.structuredResponse;
    return {
        judge_recomdetion: result
    }
}

const graph = new StateGraph(State)
    .addNode("solution", solutionNode)
    .addNode("judge", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge")
    .addEdge("judge", END)
    .compile();

    export default async function (userMessage: string){
        const result = await graph.invoke({
            messages: [
                new HumanMessage(userMessage)
            ]
        })

        console.log(result);
        
        return result.messages;
    }
