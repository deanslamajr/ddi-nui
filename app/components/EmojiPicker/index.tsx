import { ChangeEvent, FC, useRef, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import baseEmojiData from "@emoji-mart/data";
// @ts-ignore
import { init, SearchIndex } from "emoji-mart";
import styled from "styled-components";

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

const emojis = filterNativeEmojis(Object.values(baseEmojiData.emojis));

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

function _shuffleEmojis() {
  return shuffle(emojis);
}

let initialEmojiSet = _shuffleEmojis();

const SearchContainer = styled.div`
  overflow-x: hidden;
  margin-top: 0.5rem;
  position: fixed;
  top: 1rem;
  width: 50rem;
  left: 50%;
  margin-left: -400px;
`;

const SearchInput = styled.input`
  display: inline-block;
  font-size: 50px; /* To avoid iOS zoom on click */
  width: 70%;
  background: linear-gradient(#eee, #fff);
  transition: all 0.3s ease-out;
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.4);
  width: 100%;
  text-align: center;

  &::placeholder {
    color: gray;
    font-size: 50px;
    opacity: 0.5;
  }
`;

const EmojisContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 2.5rem;
  margin-top: 6rem;
`;

const InnerContainer = styled.div`
  position: relative;
  background-color: ${(props) => props.theme.colors.white};
`;

const EmojiContainer = styled.span`
  width: 5rem;
  height: 5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
`;

const Emoji: FC<{
  emoji: string;
  onSelect: (emoji: string) => void;
}> = ({ emoji, onSelect }) => {
  return (
    <EmojiContainer onClick={() => onSelect(emoji)}>{emoji}</EmojiContainer>
  );
};

const EmojiPicker: FC<{
  onCancel: () => void;
  onSelect: (emoji: string) => void;
}> = ({ onCancel, onSelect }) => {
  const shuffledEmojiSet = useRef(initialEmojiSet);

  const [state, setState] = useState<{
    emojis: string[];
    inputValue: string;
  }>({
    emojis: initialEmojiSet,
    inputValue: "",
  });

  const shuffleEmojis = () => {
    shuffledEmojiSet.current = _shuffleEmojis();
    setState((prevState) => ({
      ...prevState,
      emojis: shuffledEmojiSet.current,
    }));
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;

    const emojis: string[] = searchValue
      ? await filterEmojisBySearch(searchValue)
      : Array.isArray(shuffledEmojiSet.current)
      ? Array.from(shuffledEmojiSet.current)
      : [];

    if (searchValue) {
      emojis.unshift(searchValue);
    }

    setState({
      inputValue: searchValue,
      emojis,
    });
  };

  return (
    <>
      <div className="emoji-picker-outer-container">
        <InnerContainer>
          <SearchContainer>
            <SearchInput
              type="text"
              name="search"
              onChange={handleChange}
              placeholder="emoji search"
              value={state.inputValue}
            />
          </SearchContainer>

          <EmojisContainer>
            {state.emojis.map((emoji) => (
              <Emoji key={emoji} emoji={emoji} onSelect={onSelect} />
            ))}
          </EmojisContainer>
        </InnerContainer>
      </div>

      <div className="nav-button accented bottom-left">
        <button onClick={() => onCancel()}>🔙</button>
      </div>

      <div className="nav-button bottom-right">
        <button onClick={() => shuffleEmojis()}>🔀</button>
      </div>
    </>
  );
};

export default EmojiPicker;
