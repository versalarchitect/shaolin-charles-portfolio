import { z } from 'zod';

export const BlockFeedbackSchema = z.object({
  clarity: z.number().min(1).max(5).describe('How clear and understandable is this content? 1=incomprehensible, 5=crystal clear'),
  accuracy: z.number().min(1).max(5).describe('Does the content seem factually correct? 1=major errors, 5=fully accurate'),
  completeness: z.number().min(1).max(5).describe('Are there obvious gaps or missing information? 1=major gaps, 5=thorough'),
  engagement: z.number().min(1).max(5).describe('How interesting/engaging is the content? 1=boring, 5=compelling'),
  difficulty: z.number().min(1).max(5).describe('How difficult is this for the student? 1=trivially easy, 5=way too hard'),
  confusion_points: z.array(z.string()).describe('Specific parts that were confusing or unclear'),
  questions: z.array(z.string()).describe('Questions the student has after reading this'),
  suggestions: z.array(z.string()).describe('Concrete suggestions to improve this content block'),
  reaction: z.string().describe('A 1-2 sentence authentic reaction from the student after reading this block'),
});

export type BlockFeedback = z.infer<typeof BlockFeedbackSchema>;

export const LessonFeedbackSchema = z.object({
  overall_rating: z.number().min(1).max(5).describe('Overall quality rating for the lesson'),
  flow_rating: z.number().min(1).max(5).describe('How well do the content blocks flow together? 1=disjointed, 5=seamless'),
  key_takeaways: z.array(z.string()).describe('What the student learned from this lesson'),
  gaps: z.array(z.string()).describe('Topics that should have been covered but were missing'),
  strongest_block: z.string().describe('Which content block was the best and why'),
  weakest_block: z.string().describe('Which content block needs the most improvement and why'),
  would_recommend: z.boolean().describe('Would the student recommend this lesson to a peer?'),
  summary: z.string().describe('A 2-3 sentence summary of the student experience for this lesson'),
});

export type LessonFeedback = z.infer<typeof LessonFeedbackSchema>;

export const CourseFeedbackSchema = z.object({
  overall_rating: z.number().min(1).max(5).describe('Overall course quality rating'),
  readiness_rating: z.number().min(1).max(5).describe('How prepared does the student feel to use Claude after this course?'),
  top_strengths: z.array(z.string()).describe('Top 3 things the course does well'),
  top_weaknesses: z.array(z.string()).describe('Top 3 things the course should improve'),
  missing_topics: z.array(z.string()).describe('Important topics that the course doesn\'t cover'),
  recommended_order_changes: z.array(z.string()).describe('Suggestions for reordering content'),
  nps_score: z.number().min(0).max(10).describe('Net Promoter Score: 0-10, how likely to recommend this course'),
  final_thoughts: z.string().describe('A paragraph of final thoughts from the student'),
});

export type CourseFeedback = z.infer<typeof CourseFeedbackSchema>;
