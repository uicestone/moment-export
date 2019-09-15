export default interface MomentItem {
  isCurrentUser: boolean;
  snsId: string;
  authorName: string;
  authorId: string;
  content: string;
  originalPost: {
    title: string;
    description: string;
    url: string;
    thumbnail: string;
  };
  location: string;
  comments: {
    isCurrentUser: boolean;
    authorName: string;
    authorId: string;
    content: string;
  }[];
  likes: { isCurrentUser: boolean; userName: string; userId: string }[];
  mediaList: string[];
  rawXML: string;
  timestamp: number;
  date: string;
  title?: string;
}
