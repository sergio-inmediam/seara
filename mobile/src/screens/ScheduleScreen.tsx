import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import api from "@/api/client";
import { Event } from "@/types";

dayjs.locale("pt-br");

const ScheduleScreen: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = async () => {
    setRefreshing(true);
    try {
      const response = await api.get<Event[]>("/public/events");
      setEvents(response.data);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadEvents} />}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Title title={item.title} subtitle={item.speaker ?? undefined} />
          <Card.Content>
            <Text>{dayjs(item.starts_at).format("dddd, DD/MM/YYYY HH:mm")}</Text>
            {item.location && <Text>Local: {item.location}</Text>}
            {item.description && <Text>{item.description}</Text>}
          </Card.Content>
        </Card>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text>Nenhum evento cadastrado ainda.</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 64,
  },
});

export default ScheduleScreen;
