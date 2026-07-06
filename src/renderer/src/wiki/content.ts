import { Lang } from '../i18n';
import { WIKI_EN } from './content/en';
import { WIKI_DE } from './content/de';
import { WIKI_ES } from './content/es';

export interface WikiSection {
  id: string;
  title: string;
  md: string;
}

export const WIKI_CONTENT: Record<Lang, WikiSection[]> = {
  en: WIKI_EN,
  de: WIKI_DE,
  es: WIKI_ES
};
