const fetchUpdatedUserInfo = async (username) => {
  try {
    const response = await fetch(`/api/user/data?username=${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Error fetching updated user info:", error);
    return null;
  }
};

export { fetchUpdatedUserInfo };
