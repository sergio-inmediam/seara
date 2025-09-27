import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";

interface Props {
  onSubmit: (payload: { title: string; message: string; scheduled_for: string; event_id?: number }) => Promise<void>;
}

const AlertForm: React.FC<Props> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [eventId, setEventId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !message || !scheduledFor) {
      setError("Todos os campos obrigatórios precisam ser preenchidos");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        title,
        message,
        scheduled_for: scheduledFor,
        event_id: eventId ? Number(eventId) : undefined,
      });
      setTitle("");
      setMessage("");
      setScheduledFor("");
      setEventId("");
    } catch (e) {
      setError("Não foi possível salvar o alerta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput label="Título" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput
        label="Mensagem"
        value={message}
        onChangeText={setMessage}
        style={styles.input}
        multiline
      />
      <TextInput
        label="Agendar para (ISO)"
        value={scheduledFor}
        onChangeText={setScheduledFor}
        style={styles.input}
      />
      <TextInput
        label="Evento relacionado (ID opcional)"
        value={eventId}
        onChangeText={setEventId}
        style={styles.input}
        keyboardType="numeric"
      />
      {error && <HelperText type="error">{error}</HelperText>}
      <Button mode="contained" onPress={handleSubmit} loading={loading}>
        Salvar alerta
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  input: {
    backgroundColor: "transparent",
  },
});

export default AlertForm;
