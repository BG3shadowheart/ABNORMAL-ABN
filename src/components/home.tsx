import { HomeDeck } from '@/components/home-deck';
import { findLocalCharacters } from '@/lib/local-art';

/** Server wrapper keeps local art discovery out of the browser bundle. */
export function Home() {
  return <HomeDeck characters={findLocalCharacters()} />;
}
