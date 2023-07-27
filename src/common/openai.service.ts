import { Injectable } from '@nestjs/common';

import { ChatCompletionRequestMessage, ChatCompletionResponseMessage, Configuration, OpenAIApi } from "openai";
import { Message } from 'src/babbles/interfaces/message.interface';

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
        {"role":"assistant", "content":"그러게. 밖에 나가서 놀고 싶다."}
    ];

    async createAIbabble(message : ChatCompletionRequestMessage) {
        this.messages.push(message);
        const response = await openai.createChatCompletion({
            model : "gpt-3.5-turbo",
            messages : this.messages
        });
        
        this.messages.push(response.data.choices[0].message);
        return this.messages[this.messages.length - 1];
    }
}