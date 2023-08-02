import { Injectable } from '@nestjs/common';

import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
  Configuration,
  OpenAIApi,
} from 'openai';

const configuration = new Configuration({
  organization: 'org-jPO32mgFLsFXUbX0VhM5CsXo',
  apiKey: '',
});
const openai = new OpenAIApi(configuration);

@Injectable()
export class OpenAIService {
  async createAIbabble(
    messages?: ChatCompletionRequestMessage[] | any,
  ): Promise<ChatCompletionResponseMessage> {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    // console.log(response.data.choices[0].message);

    return response.data.choices[0].message;
  }
}
