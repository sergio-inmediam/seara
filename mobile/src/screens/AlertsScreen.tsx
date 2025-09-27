import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import api from "@/api/client";
import { SearaAlert } from "@/types";

dayjs.locale("pt-br");

const AlertsScreen: React.FC = () => {
  const [alerts, setAlerts] = useState<SearaAlert[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAlerts = async () => {
    setRefreshing(true);
    try {
      const response = await api.get<SearaAlert[]>("/public/alerts");
      setAlerts(response.data);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <FlatList
      data={alerts}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadAlerts} />}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Title title={item.title} />
          <Card.Content>
            <Text>{item.message}</Text>
            <Text>Agendado para: {dayjs(item.scheduled_for).format("DD/MM/YYYY HH:mm")}</Text>
            {item.sent_at && <Text>Enviado em: {dayjs(item.sent_at).format("DD/MM/YYYY HH:mm")}</Text>}
            <Text>Tipo: {item.is_auto ? "Automático" : "Manual"}</Text>
          </Card.Content>
        </Card>
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text>Nenhum alerta cadastrado.</Text>
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

export default AlertsScreen;
