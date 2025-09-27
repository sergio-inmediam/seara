import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import api from "@/api/client";
import { ConfessionSlot } from "@/types";

dayjs.locale("pt-br");

const ConfessionScreen: React.FC = () => {
  const [slots, setSlots] = useState<ConfessionSlot[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadSlots = async () => {
    setRefreshing(true);
    try {
      const response = await api.get<ConfessionSlot[]>("/public/confessions");
      setSlots(response.data);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  return (
    <FlatList
      data={slots}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadSlots} />}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Title title={item.location ?? "Confissão"} subtitle={item.priest ?? undefined} />
          <Card.Content>
            <Text>
              {dayjs(item.starts_at).format("DD/MM/YYYY HH:mm")} - {dayjs(item.ends_at).format("HH:mm")}
            </Text>
            {item.notes && <Text>{item.notes}</Text>}
          </Card.Content>
        </Card>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text>Nenhum horário cadastrado.</Text>
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

export default ConfessionScreen;
