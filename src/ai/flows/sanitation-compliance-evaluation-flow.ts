'use server';
/**
 * @fileOverview An AI agent for evaluating sanitation service reports and site maintenance plans
 * against Rwandan national professional standards.
 *
 * - evaluateSanitationCompliance - A function that handles the compliance evaluation process.
 * - SanitationComplianceEvaluationInput - The input type for the evaluateSanitationCompliance function.
 * - SanitationComplianceEvaluationOutput - The return type for the evaluateSanitationCompliance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SanitationComplianceEvaluationInputSchema = z.object({
  reportContent: z
    .string()
    .describe(
      'The full text content of the sanitation service report or site maintenance plan.'
    ),
  reportType: z
    .enum(['service_report', 'maintenance_plan', 'other'])
    .default('other')
    .describe(
      'The type of document being evaluated (e.g., service_report, maintenance_plan).'
    ),
  additionalContext: z
    .string()
    .optional()
    .describe('Any additional context or specific guidelines to consider.'),
});
export type SanitationComplianceEvaluationInput = z.infer<
  typeof SanitationComplianceEvaluationInputSchema
>;

const SanitationComplianceEvaluationOutputSchema = z.object({
  isCompliant: z
    .boolean()
    .describe('True if the document is largely compliant with standards, false otherwise.'),
  summary: z
    .string()
    .describe('A brief summary of the compliance evaluation.'),
  complianceAreas: z
    .array(z.string())
    .describe('List of specific areas where the document demonstrates compliance.'),
  nonComplianceAreas: z
    .array(z.string())
    .describe('List of specific areas where the document is non-compliant or has shortcomings.'),
  recommendations: z
    .string()
    .describe('Actionable recommendations to improve compliance and meet required criteria.'),
});
export type SanitationComplianceEvaluationOutput = z.infer<
  typeof SanitationComplianceEvaluationOutputSchema
>;

export async function evaluateSanitationCompliance(
  input: SanitationComplianceEvaluationInput
): Promise<SanitationComplianceEvaluationOutput> {
  return sanitationComplianceEvaluationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'sanitationComplianceEvaluationPrompt',
  input: {schema: SanitationComplianceEvaluationInputSchema},
  output: {schema: SanitationComplianceEvaluationOutputSchema},
  prompt: `You are an expert AI assistant specialized in evaluating sanitation documents against Rwandan national professional standards.
Your task is to analyze the provided \"{{{reportType}}}\" and determine its compliance with these standards. Focus on identifying areas that meet the criteria and areas that fall short.

After your analysis, provide:
1. An overall compliance status (true/false).
2. A concise summary of the evaluation.
3. A list of specific areas where the document demonstrates good compliance.
4. A list of specific areas of non-compliance or where the document needs improvement.
5. Actionable recommendations to achieve full compliance.

Consider the following document content:

Report/Plan Content:
{{{reportContent}}}

{{#if additionalContext}}
Additional Context:
{{{additionalContext}}}
{{/if}}

Evaluate rigorously and provide clear, structured feedback based on Rwandan national professional sanitation standards.`,
});

const sanitationComplianceEvaluationFlow = ai.defineFlow(
  {
    name: 'sanitationComplianceEvaluationFlow',
    inputSchema: SanitationComplianceEvaluationInputSchema,
    outputSchema: SanitationComplianceEvaluationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI did not provide an output for compliance evaluation.');
    }
    return output;
  }
);
