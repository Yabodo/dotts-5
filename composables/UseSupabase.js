export const useSupabaseDatabase = () => {
  const supabase = useSupabaseClient();
  const user = ref(null)
  const profile = ref(null)
  const notification = ref("")

  const handleError = (error, customMessage) => {
    console.error(customMessage, error);
    throw error;
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error;
      user.value = data.user
      await getProfileById(user.value.id)
    } catch (error) {
      handleError(error, "Error signing in user:");
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error;
      user.value = null;
      profile.value = null;
      notification.value = "Signed out successfully!";
      navigateTo('/')
    } catch (error) {
      handleError(error, "Error signing out user:");
      notification.value = "Error signing out. Please try again.";
    }
  }

  async function signUp(email, password) {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error) {
      handleError(error, "Error signing up user:");
    }
  }

  async function getUser() {
    try {
      const {
        data,
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      user.value = data.user;
      console.log('user', user.value)
      return true
    } catch (error) {
      user.value = null;
      return false
    }
  }

  const getProfileById = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, name, note")
        .eq("id", userId)
        .single();

      if (error) throw error;
      profile.value = data
      console.log(profile.value)
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
          tags!inner (walls!inner (id, name, user_id))
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
          tags (walls (id, name, user_id))
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

  const getGlobalFeed = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          id,
          note,
          created_at,
          users (id, name),
          tags (walls (id, name, user_id))
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

  const getMyFeed = async (userId) => {
    try {
      const { data, error } = await supabase
      .rpc('get_posts_from_followed_walls', { user_uuid: userId })
      .limit(10)
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error fetching your feed:");
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

  const getFollowsOfUserId = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("follows")
        .select("wall_id")
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

  const createFollow = async (wallId) => {
    try {
      const { data, error } = await supabase
        .from("follows")
        .insert([{ wall_id: wallId }])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error creating follow:");
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

  const deleteFollow = async (wallId) => {
    try {
      const { error } = await supabase.from("follows").delete().eq("wall_id", wallId);
      if (error) throw error;
    } catch (error) {
      handleError(error, "Error deleting wall follow by id:");
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
    getUser,
    getProfileById,
    getProfileByName,
    getGlobalFeed,
    getMyFeed,
    getWallsOfUserId,
    getWallByNameAndUser,
    getFeedByUserId,
    getFeedByWallNameAndUserId,
    getFollowsOfUserId,
    createPost,
    createTags,
    createWall,
    createFollow,
    deletePostById,
    deletePostTagsByPostId,
    deleteFollow,
    updateUsername,
    supabase,
    user,
    profile,
    notification,
    signIn,
    signOut,
    signUp
  };
};
