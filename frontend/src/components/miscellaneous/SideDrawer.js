import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  effect,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import NotificationBadge from "react-notification-badge";
import { Avatar } from "@chakra-ui/avatar";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../context/chatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../userAvatar/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const toast = useToast();

  const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser.id ? users[1].name : users[0].name;
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the search result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text px="4" d={{ base: "none", md: "flex" }}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Bubble Chat
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={effect.SCALE}
              />
              <BellIcon fontSize="2xl" />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => {
                return (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotification(notification.filter((n) => n !== notif));
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New Message in ${notif.chat.chatName}`
                      : `New Message from ${getSender(user, notif.chat.users)}`}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton p={1} as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        placement="left"
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by Name or Email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              <span>
                {searchResult.map((u) => {
                  return (
                    <UserListItem
                      key={u._id}
                      user={u}
                      handleFunction={() => accessChat(u._id)}
                    />
                  );
                })}
              </span>
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
