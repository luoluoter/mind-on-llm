import { MOCK_TAG } from '../llmAdapter.js';

const cleanBullet = (line) => line.replace(/^[-*\d\.\)\s]+/, '').trim();

export const isMockResponse = (text) =>
  typeof text === 'string' && text.includes(MOCK_TAG);

export const stripMockMarker = (text) =>
  isMockResponse(text) ? text.replace(MOCK_TAG, '').trim() : text;

export const parseMockStructuredText = (text) => {
  if (!isMockResponse(text)) {
    return null;
  }

  const cleaned = stripMockMarker(text);
  const sections = {
    Summary: [],
    Suggestions: [],
    Risks: [],
  };

  let currentSection = null;
  cleaned.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }

    if (/^Summary:/i.test(trimmed)) {
      currentSection = 'Summary';
      const content = trimmed.replace(/^Summary:\s*/i, '').trim();
      if (content) {
        sections.Summary.push(content);
      }
      return;
    }

    if (/^Suggestions:/i.test(trimmed)) {
      currentSection = 'Suggestions';
      return;
    }

    if (/^Risks:/i.test(trimmed)) {
      currentSection = 'Risks';
      return;
    }

    if (currentSection === 'Summary') {
      sections.Summary.push(trimmed);
    } else if (currentSection === 'Suggestions') {
      const suggestion = cleanBullet(trimmed);
      if (suggestion) {
        sections.Suggestions.push(suggestion);
      }
    } else if (currentSection === 'Risks') {
      const risk = cleanBullet(trimmed);
      if (risk) {
        sections.Risks.push(risk);
      }
    }
  });

  return {
    summary: sections.Summary.join(' ').trim(),
    suggestions: sections.Suggestions,
    risks: sections.Risks,
  };
};
