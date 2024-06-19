import React, { useState, useEffect } from "react";
import { Container, Text, VStack, Input, Box, Link, Flex, Switch, useColorMode } from "@chakra-ui/react";
import axios from "axios";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const topStoriesRes = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
        const topStoryIds = topStoriesRes.data.slice(0, 5);
        const storyPromises = topStoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const storiesData = await Promise.all(storyPromises);
        setStories(storiesData.map(res => res.data));
      } catch (error) {
        console.error("Error fetching top stories:", error);
      }
    };

    fetchTopStories();
  }, []);

  const filteredStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Container centerContent maxW="container.md" py={8}>
      <Flex justifyContent="space-between" width="100%" mb={4}>
        <Text fontSize="2xl">Hacker News Top Stories</Text>
        <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} />
      </Flex>
      <Input
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />
      <VStack spacing={4} width="100%">
        {filteredStories.map(story => (
          <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" width="100%">
            <Text fontSize="xl" fontWeight="bold">{story.title}</Text>
            <Link href={story.url} color="teal.500" isExternal>Read more</Link>
            <Text mt={2}>Upvotes: {story.score}</Text>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;