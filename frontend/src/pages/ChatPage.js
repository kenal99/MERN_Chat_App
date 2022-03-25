import React, { useState } from "react";
import { ChatState } from "../context/chatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import { Box } from "@chakra-ui/react";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div className=".chat" style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
