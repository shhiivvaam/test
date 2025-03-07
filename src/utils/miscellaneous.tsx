import { child, get, ref } from "firebase/database";
import { database } from "../firebase/firebase";

export const fetchToUIDs = async (workspaceId: string | undefined) => {
  try {
    const membersRef = ref(
      database,
      `workspace/${workspaceId}/participants/members`
    );
    const snapshot = await get(child(membersRef, "/"));
    if (snapshot.exists()) {
      // Map over the members to extract the toUIDs
      const toUIDs = Object.values(snapshot.val()).map(
        (member: any) => member.toUID
      );
      return toUIDs;
    } else {
      console.log("No members found");
      return [];
    }
  } catch (error) {
    console.error("Error fetching toUIDs:", error);
    return [];
  }
};
