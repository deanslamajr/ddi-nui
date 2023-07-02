import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import baseEmojiData from "@emoji-mart/data";
// @ts-ignore
import { init, SearchIndex } from "emoji-mart";

import stylesUrl from "~/styles/components/EmojiPicker.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

init({ data: baseEmojiData });

type BaseEmoji = {
  id: string;
  name: string;
  keywords: string[];
  skins: Array<{
    unified: string;
    native: string;
  }>;
};

type ExcludesUndefined = <T>(x: T | undefined) => x is T;
const filterNativeEmojis = (emojis: BaseEmoji[]): string[] =>
  emojis
    .map((emoji) => {
      const emojiSkins = emoji.skins;
      if (emojiSkins.length) {
        const skin = emojiSkins[0];
        return skin.native;
      }
      return undefined;
    })
    .filter<string>(Boolean as any as ExcludesUndefined);

const filterEmojisBySearch = async (value: string) => {
  const searchResult: BaseEmoji[] = await SearchIndex.search(value);
  return filterNativeEmojis(searchResult);
};

// from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array#answer-2450976
function shuffle(array: string[]) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const unfilteredEmojis = Object.values(baseEmojiData.emojis);

function _shuffleEmojis() {
  const emojis = filterNativeEmojis(unfilteredEmojis);
  return shuffle(emojis);
}

const initialEmojiSet = _shuffleEmojis();

const EmojiPicker: FC<{
  initialValue: string;
  onSelect: (emoji: string) => void;
}> = ({ initialValue, onSelect }) => {
  // const shuffledEmojiSet = useRef(initialEmojiSet);

  const [baseEmojiSet, setBaseEmojiSet] = useState(initialEmojiSet);
  const [emojis, setEmojis] = useState(initialEmojiSet);
  const [searchValue, setSearchValue] = useState(initialValue);

  useEffect(() => {
    const filterEmojis = async () => {
      const emojis: string[] = searchValue
        ? await filterEmojisBySearch(searchValue)
        : Array.isArray(baseEmojiSet)
        ? Array.from(baseEmojiSet)
        : [];

      if (!emojis.find((emoji) => searchValue === emoji)) {
        emojis.unshift(searchValue);
      }
      return emojis;
    };

    filterEmojis().then((emojis) => {
      setEmojis(emojis);
    });
  }, [baseEmojiSet, searchValue]);

  const shuffleEmojis = () => {
    // shuffledEmojiSet.current = ;
    setEmojis(_shuffleEmojis());
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <>
      <div className="emoji-picker-outer-container">
        <div className="emoji-picker-inner-container">
          <div className="emoji-picker-search-container">
            <input
              className="emoji-picker-search-input"
              type="text"
              name="search"
              onChange={handleChange}
              placeholder="emoji search"
              value={searchValue}
            />
          </div>
          <div className="emoji-picker-emojis-container">
            {emojis.map((emoji) => (
              <span
                className="emoji-picker-emoji-container"
                key={emoji}
                onClick={() => onSelect(emoji)}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="nav-button top-right">
        <button onClick={() => shuffleEmojis()}>🔀</button>
      </div>
    </>
  );
};

export default EmojiPicker;
