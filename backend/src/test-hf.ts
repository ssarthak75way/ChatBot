import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

async function test() {
  try {
    const stream = hf.chatCompletionStream({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 10,
    });
    for await (const chunk of stream) {
      console.log(chunk.choices[0]?.delta?.content || "");
    }
    console.log("SUCCESS");
  } catch (err) {
    console.error("FAILURE", err);
  }
}

test();
