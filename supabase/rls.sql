-- ========================================
-- Row Level Security Policies
-- ========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- ---- Profiles ----
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- ---- Papers ----
CREATE POLICY "Approved papers are viewable by everyone"
  ON papers FOR SELECT USING (approved = true OR uploaded_by = auth.uid());

CREATE POLICY "Authenticated users can insert papers"
  ON papers FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own papers"
  ON papers FOR UPDATE USING (uploaded_by = auth.uid());

CREATE POLICY "Users can delete their own papers"
  ON papers FOR DELETE USING (uploaded_by = auth.uid());

-- Admin override
CREATE POLICY "Admins can do everything with papers"
  ON papers FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ---- Notes ----
CREATE POLICY "Notes are viewable by everyone"
  ON notes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert notes"
  ON notes FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can manage their own notes"
  ON notes FOR UPDATE USING (uploaded_by = auth.uid());

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE USING (uploaded_by = auth.uid());

-- ---- Bookmarks ----
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create bookmarks"
  ON bookmarks FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE USING (user_id = auth.uid());

-- ---- Likes ----
CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT USING (true);

CREATE POLICY "Users can create likes"
  ON likes FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own likes"
  ON likes FOR DELETE USING (user_id = auth.uid());

-- ---- Comments ----
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE USING (user_id = auth.uid());

-- ---- Reports ----
CREATE POLICY "Users can create reports"
  ON reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage reports"
  ON reports FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ---- Follows ----
CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT USING (true);

CREATE POLICY "Users can create follows"
  ON follows FOR INSERT WITH CHECK (follower_id = auth.uid());

CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE USING (follower_id = auth.uid());
