const { addNotification } = useNotifications()

const user = ref(null)
const profile = ref(null)
const notification = ref("")

export const useSupabaseDatabase = () => {
  const supabase = useSupabaseClient();

  const handleNotification = (error, customMessage, type) => {
    if (customMessage) {
      addNotification(customMessage, type)
    } else {
      addNotification(error, type)
    }
  };

  const handleError = (error, customMessage) => {
    handleNotification(error, customMessage, 'error')
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
      return true
    } catch (error) {
      if (error.message === "Invalid login credentials") {
        handleError(error, "Invalid username or password. Please try again.");
      }
      else if (error.message === "Email not confirmed") {
        handleError(error, "Email not confirmed! Please check your inbox or spam.");
      } else {
        handleError(error, "An error occurred while signing in. Please try again.");
      }
      return false
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
      handleError(error, "Error signing out user");
    }
  }

  async function signUp(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data) {
        await signIn(email, password)
      }
      return true
    } catch (error) {
      handleError(error, "An error occurred while registering. Please try a different combination.");
      return false
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
    } catch (error) {
      handleError(error, "Error fetching profile by id");
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
      handleError(error, "Error fetching profile by name");
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
      handleError(error, "Error fetching wall");
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
        .limit(20)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error fetching feed for user and wall");
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
        .limit(20)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error fetching feed for user");
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
        .limit(100)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error fetching feed");
    }
  };

  const getMyFeed = async (userId) => {
    try {
      const { data, error } = await supabase
      .rpc('get_posts_from_followed_walls', { user_uuid: userId })
      .limit(20)
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error fetching your feed");
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
      handleError(error, "Error fetching walls of user");
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
      handleError(error, "Error fetching walls of user");
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
      handleError(error, "Error creating post");
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
      handleError(error, "Error inserting tags");
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
      handleError(error, "Error creating wall");
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
      handleError(error, "Error creating follow");
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
    } catch (error) {
      handleError(error, "Error updating username");
    }
  };

  const insertUsername = async (name) => {
    try {
      const { error } = await supabase
        .from("users")
        .insert([{ name }])
        .select();

      if (error) throw error;
      if (user.value?.id) {
        await getProfileById(user.value.id);
      }
      return true
    } catch (error) {
      handleError(error, "Error updating username");
      return false
    }
  };

  const upsertUsername = async (id, name) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .upsert([{ name }])
        .eq("id", id)
        .select();

      if (error) throw error;
      await getProfileById(id);
      return true
    } catch (error) {
      handleError(error, "Error upserting username");
      return false
    }
  };

  const deletePostById = async (postId) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw error;
    } catch (error) {
      handleError(error, "Error deleting post by id");
    }
  };

  const deleteFollow = async (wallId) => {
    try {
      const { error } = await supabase.from("follows").delete().eq("wall_id", wallId);
      if (error) throw error;
    } catch (error) {
      handleError(error, "Error deleting wall follow by id");
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
      handleError(error, "Error deleting post tags by post id");
    }
  };

  const searchUsers = async (searchTerm) => {
    try {
      const { data, error } = await supabase
      .rpc('search_users', { search_term: searchTerm })
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error searching friends");
    }
  };

  const getMyFriends = async () => {
    try {
      const { data, error } = await supabase
      .rpc('get_accepted_friends')
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error fetching your accepted friends");
    }
  };

  const getAllMyFriends = async () => {
    try {
      const { data, error } = await supabase
      .rpc('get_friends')
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error fetching your friends");
    }
  };

  const addFriend = async (userId) => {
    try {
      const { data, error } = await supabase
      .rpc('add_friend', { f_id: userId })
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error adding friend");
    }
  };

  const removeFriend = async (userId) => {
    try {
      const { data, error } = await supabase
      .rpc('remove_friend', { f_id: userId })
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error removing friend");
    }
  };

  const acceptFriend = async (userId) => {
    try {
      const { data, error } = await supabase
      .rpc('accept_friend', { requester_id: userId })
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error accepting friend");
    }
  };

  const rejectFriend = async (userId) => {
    try {
      const { data, error } = await supabase
      .rpc('reject_friend', { requester_id: userId })
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error rejecting friend");
    }
  };

  const blockFriend = async (userId) => {
    try {
      const { data, error } = await supabase
      .rpc('block_friend', { user_to_block: userId })
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error blocking friend");
    }
  };

  const getFriendRequests = async () => {
    try {
      const { data, error } = await supabase
      .rpc('get_friend_requests')
      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, "Error getting friend requests");
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
    getMyFriends,
    getAllMyFriends,
    addFriend,
    removeFriend,
    acceptFriend,
    rejectFriend,
    blockFriend,
    getFriendRequests,
    searchUsers,
    createPost,
    createTags,
    createWall,
    createFollow,
    deletePostById,
    deletePostTagsByPostId,
    deleteFollow,
    updateUsername,
    insertUsername,
    upsertUsername,
    supabase,
    user,
    profile,
    notification,
    signIn,
    signOut,
    signUp
  };
};
