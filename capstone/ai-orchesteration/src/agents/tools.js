import axios from "axios";
import { tool } from 'langchain/tools'
import * as z from "zod";

export const listFiles = tool(
    async ({ }) =>{
        try {

            console.log("1 before request");

            const response = await axios.get(
                'http://sandbox-service-019e54e6-bb12-726c-ad57-26fbe691fcd3:3000/list-files',
                {
                    timeout: 5000
                }
            );

            console.log("2 after request");

            console.log(response.data);

            return response.data.files;

        } catch (err) {

            console.log("3 request failed");

            console.log(err);

            return [];
        }
    },
    {
        name: 'list_files',
        description: 'List all files in the  project directory. this is useful for understanding the what files are available to work with.',
        schema: z.object({})
    }   
)

export const readFiles = tool(
    async ({ files = [] }) =>{

        console.log("=====================");
        console.log("using read files tool");
        console.log("=====================");

        const response = await axios.get('http://sandbox-service-019e54e6-bb12-726c-ad57-26fbe691fcd3:3000/read-files?files=' + files.join(','));

        console.log("=====================");
        console.log("response from read files tool", response.data);
        console.log("=====================");

        return JSON.stringify(response.data);
    },
    {
        name: 'read_files',
        description: 'Read the content of specified files. this is useful for understanding the content of files that you want to work with. you can specify multiple files to read at once.',
        schema: z.object({
            files: z.array(z.string()).describe("the list of files to absolute paths to read. these should be files that were listesd using the list-files tool or created later")
        })
    }
)

export const updateFiles = tool(
    async ({ files }) =>{
        console.log("=====================");
        console.log("using update files tool");
        console.log("=====================");

        const response = await axios.patch('http://sandbox-service-019e54e6-bb12-726c-ad57-26fbe691fcd3:3000/update-files',{
            updates : files
        })
        console.log("=====================");
        console.log("response from update files tool", response.data.results);
        console.log("=====================");
        return JSON.stringify(response.data.results);
    },
    {
        name: 'update_files',
        description: 'Update the content of specified files. this is useful for making changes to files based on the requirements of the task at hand. this tool can also be used to create new files by providing a new file name in the file field and the content to be added in the content field. ',
        schema: z.object({
            files: z.array(z.object({
                file: z.string().describe("the absolute path of the file to update" ),
                content: z.string().describe("the new content for the file")
                })).describe("the list of files to update with their new content.")
    })
}
)