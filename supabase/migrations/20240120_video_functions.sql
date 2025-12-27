-- Function to increment video review likes
CREATE OR REPLACE FUNCTION increment_video_likes(review_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE video_reviews SET likes = likes + 1 WHERE id = review_id;
END;
$$ LANGUAGE plpgsql;
