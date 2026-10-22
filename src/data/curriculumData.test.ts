import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CURRICULUM_MODULES,
  TOTAL_CURRICULUM_HOURS,
  CORE_MILESTONE_HOURS,
  FULL_BUILD_REFINE_HOURS,
  AUDITED_LIFECYCLE_HOURS,
  NORMALIZED_LIFETIME_HOURS,
  BUILD_REFINE_PHASES,
  AUDITED_LIFECYCLE_PHASES,
  computeCurriculumStats,
} from './curriculumData.ts';
import { computeModuleProficiency } from '../components/ModuleProficiencyGauge.tsx';

test('curriculum core hours sum strictly to 7,200h', () => {
  const sum = CURRICULUM_MODULES.reduce((acc, m) => acc + m.hours, 0);
  assert.equal(sum, 7200);
  assert.equal(TOTAL_CURRICULUM_HOURS, 7200);
  assert.equal(CORE_MILESTONE_HOURS, 7200);
});

test('comprehensive build and refine phases sum strictly to 50,400h (~50k hours)', () => {
  const sum = BUILD_REFINE_PHASES.reduce((acc, p) => acc + p.hours, 0);
  assert.equal(sum, 50400);
  assert.equal(FULL_BUILD_REFINE_HOURS, 50400);

  // Check specific phases
  const theory = BUILD_REFINE_PHASES.find((p) => p.id === 'theory');
  const reproduction = BUILD_REFINE_PHASES.find((p) => p.id === 'reproduction');
  const optimization = BUILD_REFINE_PHASES.find((p) => p.id === 'optimization');
  const verification = BUILD_REFINE_PHASES.find((p) => p.id === 'verification');
  const sre = BUILD_REFINE_PHASES.find((p) => p.id === 'sre');
  const security = BUILD_REFINE_PHASES.find((p) => p.id === 'security');

  assert.equal(theory?.hours, 7200);
  assert.equal(reproduction?.hours, 14400);
  assert.equal(optimization?.hours, 10800);
  assert.equal(verification?.hours, 9000);
  assert.equal(sre?.hours, 5400);
  assert.equal(security?.hours, 3600);
});

test('audited lifecycle phases sum strictly to 12,600h', () => {
  const sum = AUDITED_LIFECYCLE_PHASES.reduce((acc, p) => acc + p.hours, 0);
  assert.equal(sum, 12600);
  assert.equal(AUDITED_LIFECYCLE_HOURS, 12600);

  // Check specific phases
  const theory = AUDITED_LIFECYCLE_PHASES.find((p) => p.id === 'theory');
  const build = AUDITED_LIFECYCLE_PHASES.find((p) => p.id === 'build');
  const operating = AUDITED_LIFECYCLE_PHASES.find((p) => p.id === 'operating');
  const verification = AUDITED_LIFECYCLE_PHASES.find((p) => p.id === 'verification');
  const security = AUDITED_LIFECYCLE_PHASES.find((p) => p.id === 'security');

  assert.equal(theory?.hours, 7200);
  assert.equal(build?.hours, 2160);
  assert.equal(operating?.hours, 1440);
  assert.equal(verification?.hours, 1080);
  assert.equal(security?.hours, 720);
});

test('computeCurriculumStats correctly computes ratios across all 4 modes', () => {
  // Build and Refine primary mode (~50k hours)
  const buildRefineStats = computeCurriculumStats(CURRICULUM_MODULES, 'build_refine');
  assert.equal(buildRefineStats.totalHours, 50400);
  assert.equal(buildRefineStats.hourMetricMode, 'build_refine');
  assert.equal(buildRefineStats.completedHours, 5544); // 11% of 50,400h
  assert.equal(buildRefineStats.remainingHours, 44856);
  assert.equal(buildRefineStats.completedPercent, 11);

  // Audited initial state
  const auditedStats = computeCurriculumStats(CURRICULUM_MODULES, 'audited');
  assert.equal(auditedStats.totalHours, 12600);
  assert.equal(auditedStats.hourMetricMode, 'audited');
  assert.equal(auditedStats.completedHours, 1386); // 11% of 12,600h
  assert.equal(auditedStats.completedPercent, 11);

  // Core theoretical milestone
  const coreStats = computeCurriculumStats(CURRICULUM_MODULES, 'core');
  assert.equal(coreStats.totalHours, 7200);
  assert.equal(coreStats.hourMetricMode, 'core');
  assert.equal(coreStats.completedHours, 792); // exact 11% of 7,200h
  assert.equal(coreStats.completedPercent, 11);

  // Normalized uncapped trajectory
  const normalizedStats = computeCurriculumStats(CURRICULUM_MODULES, 'normalized');
  assert.equal(normalizedStats.totalHours, 69168);
  assert.equal(normalizedStats.hourMetricMode, 'normalized');
  assert.equal(normalizedStats.completedPercent, 11);
});

test('computeModuleProficiency scales with status and time', () => {
  const completedMod = CURRICULUM_MODULES.find((m) => m.completionStatus === 'completed')!;
  const notStartedMod = CURRICULUM_MODULES.find((m) => m.completionStatus === 'not_started')!;

  const completedProficiency = computeModuleProficiency(completedMod, 0);
  const notStartedProficiency = computeModuleProficiency(notStartedMod, 0);

  assert.ok(completedProficiency.percent >= 78);
  assert.ok(notStartedProficiency.percent <= 10);

  // With extra study time
  const boosted = computeModuleProficiency(notStartedMod, 120);
  assert.ok(boosted.percent > notStartedProficiency.percent);
});
