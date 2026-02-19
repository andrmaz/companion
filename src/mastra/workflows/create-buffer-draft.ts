import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

const generateSocialMediaPost = createStep({
    id: 'generate-social-media-post',
    description: 'Generate a social media post',
    inputSchema: z.object({
        topic: z.string().describe('The topic of the post'),
        channel: z.enum(['linkedin']).describe('The social media platform for the post').default('linkedin'),
    }),
    outputSchema: z.object({
        post: z.string().describe('The generated post'),
    }),
    execute: async ({ inputData, mastra }) => {
        const { topic, channel } = inputData;
        const characterLimits: Record<string, number> = {
            linkedin: 3000,
        };
        const limit = characterLimits[channel];
        const agent = mastra.getAgent('personal');
        const output = await agent.generate(
            `Write a social media post for ${channel} about the following topic: ${topic}.
            Ensure the post is engaging and adheres to the platform's best practices.
            The post must not exceed ${limit} characters. Provide the post content only, without any additional commentary.`,
            {
                modelSettings: {
                    temperature: 0.9,
                    maxOutputTokens: 512,
                },
                structuredOutput: {
                    schema: z.object({
                        text: z.string().describe('The generated social media post content'),
                    }),
                },
                system: `You are a social media content creator. Craft engaging posts tailored for the specified platform, adhering to character limits and best practices.`,
                instructions: `Focus on creating concise, engaging content that resonates with the target audience on ${channel}.`
            });
        return { post: output.object.text };
    },
});


const addToBufferDrafts = createStep({
    id: 'add-to-buffer-drafts',
    description: 'Add the generated post to the Buffer drafts',
    inputSchema: z.object({
        post: z.string().describe('The generated post'),
    }),
    outputSchema: z.object({
        status: z.string().describe('The status of the post in the Buffer drafts'),
    }),
    execute: async ({ inputData, mastra }) => {
        const { post } = inputData;
        const agent = mastra.getAgent('personal');
        const output = await agent.generate(
            `Add the following post to the Buffer drafts: ${post} using the zapier_buffer_add_to_queue tool.
            You MUST use the tool exactly once with the post content. NEVER call the tool more than once.
            You MUST confirm the post was added by only returning the status from the tool response.`,
            {
                modelSettings: {
                    temperature: 0,
                    maxOutputTokens: 512,
                },
                maxSteps: 3,
                prepareStep: async ({ stepNumber }) => {
                    if (stepNumber === 0) {
                        return { toolChoice: { type: 'tool', toolName: 'zapier_buffer_add_to_queue' } };
                    }
                    return { toolChoice: 'none', tools: {} };
                },
            });
        return { status: output.text };
    },
});

export const createBufferDraftWorkflow = createWorkflow({
    id: 'create-buffer-draft',
    description: 'Create a social media post draft in Buffer account',
    inputSchema: z.object({
        topic: z.string().describe('The main topic or theme of the post'),
        channel: z.enum(['linkedin']).describe('The social media platform for the post').default('linkedin'),
    }),
    outputSchema: z.object({
        status: z.string().describe('The status of the post in the Buffer account'),
    }),
}).then(generateSocialMediaPost).then(addToBufferDrafts).commit();