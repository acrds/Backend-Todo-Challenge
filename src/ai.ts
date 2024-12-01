import { OpenAI } from "openai";
import { WatsonXAI } from "@ibm-cloud/watsonx-ai";

const openAIService = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
const watsonxAIService = WatsonXAI.newInstance({
    version: '2024-05-31',
    serviceUrl: 'https://us-south.ml.cloud.ibm.com'
});

export async function prompt(roleDescription: string, prompt: string, modelProvider: string) {
    if (modelProvider.includes("gpt")) {
        const completion = await openAIService.chat.completions.create({
            model: process.env.OPENAI_MODEL!,
            messages: [
              { role: "system", content: roleDescription },
              { role: "user", content: prompt },
            ],
          });
      
        return completion.choices[0]?.message?.content || "No description generated.";
    }else if (modelProvider.includes("ibm")) {
        const response = await watsonxAIService.generateText( {
            input: `<|start_of_role|>system<|end_of_role|>${roleDescription}<|end_of_text|>\n<|start_of_role|>user<|end_of_role|>${prompt}<|end_of_text|>\n<|start_of_role|>assistant<|end_of_role|>`,
            modelId: process.env.WATSONX_MODEL!,
            projectId: process.env.WATSONX_AI_PROJECT_ID!,
            parameters: {
              max_new_tokens: 300,
            },
          }
        );
        return response.result.results[0].generated_text;
    }
}