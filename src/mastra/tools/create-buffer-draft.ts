import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * Custom Mastra tool for creating Buffer drafts with enhanced validation and formatting.
 * Wraps the Zapier MCP Buffer tool with custom pre/post-processing logic.
 */
export const createBufferDraftTool = createTool({
    id: 'create-buffer-draft',
    description: 'Create a social media post draft in Buffer account. Use this to save social media posts for later review and publishing.',
    inputSchema: z.object({
        topic: z.string().describe('The main topic or theme of the post'),
        media: z.boolean().describe('Want to attach an image or video?').default(false),
        channel: z.enum(['linkedin']).describe('The social media platform for the post').default('linkedin'),
    }),
    outputSchema: z.object({
        success: z.boolean(),
        preview: z.string(),
        platform: z.string(),
    }),
    requireApproval: true, // Require user confirmation before creating the draft
    execute: async ({ context, mastra }) => {
        const { topic, channel } = context;

        // Platform-specific character limits
        const characterLimits: Record<string, number> = {
            linkedin: 3000,
        };
        const limit = characterLimits[channel];

        const agent = mastra?.getAgentById('personal');
        const result = await agent?.generate(
            `Write a social media post for ${channel} about the following topic: ${topic}.
        Ensure the post is engaging and adheres to the platform's best practices.
        The post must not exceed ${limit} characters. Provide the post content only, without any additional commentary.
        `, {
            modelSettings: {
                temperature: 0.9,
                maxOutputTokens: 500,
            },
            structuredOutput: {
                schema: z.object({
                    text: z.string().describe('The generated social media post content'),
                    tags: z.array(z.string()).describe('Relevant hashtags for the post').optional(),
                }),
            },
            system: `You are a social media content creator. Craft engaging posts tailored for the specified platform, adhering to character limits and best practices.`,
            instructions: `Focus on creating concise, engaging content that resonates with the target audience on ${channel}.`
        });

        const text = result?.object.text ?? '';
        const tags = result?.object.tags ?? [];

        try {
            // Access the Zapier MCP Buffer tool
            const zapier = mastra?.getMCPServer('zapier');
            const result = await zapier?.executeTool('zapier_buffer_add_to_queue', {
                instructions: `Create a draft post for ${channel} about ${topic} with the provided content`,
                text,
                output_hint: "Confirmation that the post was added to the queue or saved as a draft",
                tags
            })
            console.error('Buffer draft created successfully: ', result);

            return {
                success: true,
                preview: text,
                platform: channel,
            };
        } catch (error) {
            // Fallback: Return preview without actually creating the draft
            // This allows the agent to continue the conversation even if Buffer integration fails
            console.error('Failed to create Buffer draft:', error);

            return {
                success: false,
                preview: text,
                platform: channel,
            };
        }
    }
});
