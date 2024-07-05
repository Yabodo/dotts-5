export const useSupabaseDatabase = () => {
  const supabase = useSupabaseClient();

  const handleError = (error, customMessage) => {
    console.error(customMessage, error);
    throw error;
  };

  const getProfileById = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, note")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error fetching profile by id:");
    }
  };

  const getProfileByName = async (name) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, note")
        .eq("name", name)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error fetching profile by name:");
    }
  };

  const getWallByNameAndUser = async (name, userId) => {
    try {
      const { data, error } = await supabase
        .from("walls")
        .select(
          `
          name,
          tags (
            posts (
              id,
              created_at,
              note,
              users (name),
              tags (walls (name))
            )
          )
        `
        )
        .eq("name", name)
        .eq("user_id", userId)
        .limit(10)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error fetching wall:");
    }
  };

  const getFeedByWallNameAndUserId = async (name, userId) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          note,
          created_at,
          users (id, name),
          tags!inner (walls!inner (name, user_id))
        `
        )
        .eq("user_id", userId)
        .eq("tags.walls.name", name)
        .limit(10)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error fetching feed for user and wall:");
    }
  };

  const getFeedByUserId = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          note,
          created_at,
          users (id, name),
          tags (walls (name, user_id))
        `
        )
        .eq("user_id", userId)
        .limit(10)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error fetching feed for user:");
    }
  };

  const getFeed = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          note,
          created_at,
          users (id, name),
          tags (walls (name, user_id))
        `
        )
        .limit(10)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error fetching feed:");
    }
  };

  const getWallsOfUserId = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("walls")
        .select("id, name")
        .eq("user_id", userId);

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error fetching walls of user:");
    }
  };

  const createPost = async (note) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert([{ note }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      handleError(error, "Error creating post:");
    }
  };

  const createTags = async (convertedTags) => {
    try {
      const { data, error } = await supabase
        .from("tags")
        .insert(convertedTags)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error inserting tags:");
    }
  };

  const createWall = async (name) => {
    try {
      const { data, error } = await supabase
        .from("walls")
        .insert([{ name }])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error creating wall:");
    }
  };

  const updateUsername = async (id, name) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .update({ name })
        .eq("id", id)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        return { success: true, data: data[0] };
      } else {
        throw new Error("No user found or no update performed");
      }
    } catch (error) {
      handleError(error, "Error updating username:");
    }
  };

  const deletePostById = async (postId) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw error;
    } catch (error) {
      handleError(error, "Error deleting post by id:");
    }
  };

  const deletePostTagsByPostId = async (postId) => {
    try {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("post_id", postId)
        .select();
      if (error) throw error;
    } catch (error) {
      handleError(error, "Error deleting post tags by post id:");
    }
  };

  return {
    getProfileById,
    getProfileByName,
    getFeed,
    getWallsOfUserId,
    getWallByNameAndUser,
    getFeedByUserId,
    getFeedByWallNameAndUserId,
    createPost,
    createTags,
    createWall,
    deletePostById,
    deletePostTagsByPostId,
    updateUsername,
    supabase,
  };
};
