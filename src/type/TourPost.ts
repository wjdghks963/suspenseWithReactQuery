interface TourPostData {
  id: string;
  description: string;
  coverImageUrl: string;
  name: string;
  reviews: { averageRating: number; count: number };
  like: { isLiked: boolean; count: number };
}
