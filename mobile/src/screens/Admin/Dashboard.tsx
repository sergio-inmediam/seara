import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Divider, IconButton, List, Text } from "react-native-paper";

import api from "@/api/client";
import EventForm from "@/components/EventForm";
import AlertForm from "@/components/AlertForm";
import ConfessionForm from "@/components/ConfessionForm";
import { useAuth } from "@/context/AuthContext";
import { ConfessionSlot, Event, SearaAlert } from "@/types";

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [alerts, setAlerts] = useState<SearaAlert[]>([]);
  const [confessions, setConfessions] = useState<ConfessionSlot[]>([]);

  const loadData = useCallback(async () => {
    const [eventRes, alertRes, confessionRes] = await Promise.all([
      api.get<Event[]>("/public/events"),
      api.get<SearaAlert[]>("/public/alerts"),
      api.get<ConfessionSlot[]>("/public/confessions"),
    ]);
    setEvents(eventRes.data);
    setAlerts(alertRes.data);
    setConfessions(confessionRes.data);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateEvent = async (payload: {
    title: string;
    speaker?: string;
    location?: string;
    description?: string;
    starts_at: string;
    ends_at?: string;
    day_label?: string;
  }) => {
    await api.post("/admin/events", payload);
    await loadData();
  };

  const handleCreateAlert = async (payload: {
    title: string;
    message: string;
    scheduled_for: string;
    event_id?: number;
  }) => {
    await api.post("/admin/alerts", payload);
    await loadData();
  };

  const handleCreateConfession = async (payload: {
    location?: string;
    starts_at: string;
    ends_at: string;
    priest?: string;
    notes?: string;
  }) => {
    await api.post("/admin/confessions", payload);
    await loadData();
  };

  const handleDeleteConfession = async (id: number) => {
    await api.delete(`/admin/confessions/${id}`);
    await loadData();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">Painel administrativo</Text>
        <Button mode="outlined" onPress={logout}>
          Sair
        </Button>
      </View>

      <Card style={styles.card}>
        <Card.Title title="Cadastrar evento" />
        <Card.Content>
          <EventForm onSubmit={handleCreateEvent} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Cadastrar alerta manual" />
        <Card.Content>
          <AlertForm onSubmit={handleCreateAlert} />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Cadastrar horário de confissão" />
        <Card.Content>
          <ConfessionForm onSubmit={handleCreateConfession} />
        </Card.Content>
      </Card>

      <List.Section>
        <List.Subheader>Eventos cadastrados</List.Subheader>
        {events.map((event) => (
          <List.Item
            key={event.id}
            title={event.title}
            description={`${event.speaker ?? ""} - ${event.starts_at}`}
            left={(props) => <List.Icon {...props} icon="calendar" />}
          />
        ))}
        {events.length === 0 && <Text>Nenhum evento cadastrado.</Text>}
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Alertas cadastrados</List.Subheader>
        {alerts.map((alert) => (
          <List.Item
            key={alert.id}
            title={alert.title}
            description={`${alert.scheduled_for} - ${alert.is_auto ? "Automático" : "Manual"}`}
            left={(props) => <List.Icon {...props} icon="bell" />}
          />
        ))}
        {alerts.length === 0 && <Text>Nenhum alerta cadastrado.</Text>}
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Confissões</List.Subheader>
        {confessions.map((confession) => (
          <List.Item
            key={confession.id}
            title={confession.location ?? "Confissão"}
            description={`${confession.starts_at} - ${confession.ends_at}`}
            left={(props) => <List.Icon {...props} icon="church" />}
            right={() => (
              <IconButton icon="delete" onPress={() => handleDeleteConfession(confession.id)} />
            )}
          />
        ))}
        {confessions.length === 0 && <Text>Nenhum horário cadastrado.</Text>}
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
});

export default AdminDashboard;
