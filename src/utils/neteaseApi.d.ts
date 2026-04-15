/**
 * 网易云音乐 API 类型定义
 */

export interface Song {
  id: number;
  name: string;
  artist: string;
  album: string;
  cover: string;
  duration: number;
  src?: string;
  lyrics?: Lyric[];
}

export interface Lyric {
  time: number;
  text: string;
}

export function getSongDetail(id: number | string): Promise<Song | null>;
export function getSongUrl(id: number | string): Promise<string>;
export function getLyric(id: number | string): Promise<Lyric[]>;
export function searchSongs(keyword: string, limit?: number): Promise<Song[]>;
export function getPlaylistSongs(playlistId: number | string, limit?: number): Promise<Song[]>;
export function getFullSongsInfo(ids: (number | string)[]): Promise<Song[]>;

export const JAY_CHOU_SONGS: number[];
export const MY_PLAYLIST_ID: string;
export const PLAYLIST_LIMIT: number;
