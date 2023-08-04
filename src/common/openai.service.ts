import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
  Configuration,
  OpenAIApi,
} from 'openai';

@Injectable()
export class OpenAIService {
  async createAIbabble(
    messages?: ChatCompletionRequestMessage[] | any,
  ): Promise<ChatCompletionResponseMessage> {
    const configuration = new Configuration({
      organization: 'org-jPO32mgFLsFXUbX0VhM5CsXo',
      apiKey: process.env.OPEN_AI_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    // console.log(response.data.choices[0].message);

    return response.data.choices[0].message;
  }
}
