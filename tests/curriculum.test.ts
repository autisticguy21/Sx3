import test from 'node:test';
import assert from 'node:assert/strict';
import { CURRICULUM_MODULES, computeCurriculumStats } from '../src/data/curriculumData.ts';
import { REPOSITORY_DATABASE } from '../src/data/repoCatalog.ts';
import { REPO_STUDY_GUIDES, getStudyGuideForRepo } from '../src/data/repoStudyGuide.ts';

test('Curriculum modules sum exactly to 7,200 hours without budget inflation', () => {
  const stats = computeCurriculumStats(CURRICULUM_MODULES);
  assert.equal(stats.totalHours, 7200, 'Total curriculum hours must be exactly 7,200');
  assert.equal(CURRICULUM_MODULES.length, 25, 'Total modules count must be 25');
});

test('Demanded repositories are indexed and contain required metadata', () => {
  const repoNames = REPOSITORY_DATABASE.map((r) => r.name);
  assert.ok(repoNames.includes('robustadev/robusta'), 'robustadev/robusta must be present');
  assert.ok(repoNames.includes('deepset-ai/haystack'), 'deepset-ai/haystack must be present');
  assert.ok(repoNames.includes('langchain-ai/langgraph'), 'langchain-ai/langgraph must be present');
  assert.ok(repoNames.includes('langfuse/langfuse'), 'langfuse/langfuse must be present');
  assert.ok(repoNames.includes('BerriAI/litellm'), 'BerriAI/litellm must be present');
  assert.ok(repoNames.includes('MadryLab/robustness'), 'MadryLab/robustness must be present');
});

test('Study guides have 2 non-overlapping books and elite university lecture tracks', () => {
  const robustaGuide = getStudyGuideForRepo('robustadev/robusta', 'NM08');
  assert.ok(robustaGuide.book1.title.length > 0, 'Book 1 must be defined');
  assert.ok(robustaGuide.book2.title.length > 0, 'Book 2 must be defined');
  assert.notEqual(robustaGuide.book1.title, robustaGuide.book2.title, 'Books must be non-overlapping');
  assert.ok(robustaGuide.book2.nonOverlappingRationale.length > 0, 'Non-overlapping rationale must be present');
  assert.ok(robustaGuide.videoLectures.some((v) => v.institution === 'ETH Zurich'), 'ETH Zurich track required');
  assert.ok(robustaGuide.videoLectures.some((v) => v.institution === 'Chinese Elite (Eng / Sub-Eng)'), 'Chinese elite track required');
  assert.ok(robustaGuide.videoLectures.some((v) => v.institution === 'US Elite (Stanford/MIT/Berkeley)'), 'US elite track required');
  assert.ok(robustaGuide.reproductionRoadmap.targetLanguage, 'Reproduction roadmap target language required');
});
