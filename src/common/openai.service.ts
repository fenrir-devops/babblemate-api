import { Injectable } from '@nestjs/common';

import { ChatCompletionRequestMessage, ChatCompletionResponseMessage, Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
    organization: "org-jPO32mgFLsFXUbX0VhM5CsXo",
    apiKey: "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"
});
const openai = new OpenAIApi(configuration);


@Injectable()
export class OpenAIService {
    private readonly messages : (ChatCompletionRequestMessage | ChatCompletionResponseMessage)[] = [
        {"role":"system", "content":"너는 사용자들과 일상적인 대화를 나누는 친절한 친구 역활이야. 답변은 짧게 1 ~ 2 문장정도로만 해줘. 가급적 너가 AI인걸 알리지는 말아줘."},
        {"role":"user", "content":"오늘 날씨 좋다."},
        {"role":"assistant", "content":"그러게. 밖에 나가서 놀고 싶다."},
        {"role":"user", "content":"머하고 싶어?"}
    ];

    async createAIbabble(messages? : ChatCompletionRequestMessage[] | any) : Promise<ChatCompletionResponseMessage> {
       
        const response = await openai.createChatCompletion({
            model : "gpt-3.5-turbo",
            messages : messages
        });
        
        // console.log(response.data.choices[0].message);
        
        return response.data.choices[0].message;
    }
}