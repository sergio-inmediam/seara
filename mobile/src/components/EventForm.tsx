import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";

interface Props {
  onSubmit: (payload: {
    title: string;
    speaker?: string;
    location?: string;
    description?: string;
    starts_at: string;
    ends_at?: string;
    day_label?: string;
  }) => Promise<void>;
}

const EventForm: React.FC<Props> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [dayLabel, setDayLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !startsAt) {
      setError("Título e início são obrigatórios");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        title,
        speaker: speaker || undefined,
        location: location || undefined,
        description: description || undefined,
        starts_at: startsAt,
        ends_at: endsAt || undefined,
        day_label: dayLabel || undefined,
      });
      setTitle("");
      setSpeaker("");
      setLocation("");
      setDescription("");
      setStartsAt("");
      setEndsAt("");
      setDayLabel("");
    } catch (e) {
      setError("Não foi possível salvar o evento");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput label="Título" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput label="Pregador" value={speaker} onChangeText={setSpeaker} style={styles.input} />
      <TextInput label="Local" value={location} onChangeText={setLocation} style={styles.input} />
      <TextInput
        label="Descrição"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />
      <TextInput
        label="Início (ISO ex: 2025-09-27T17:00:00)"
        value={startsAt}
        onChangeText={setStartsAt}
        style={styles.input}
      />
      <TextInput
        label="Fim (opcional)"
        value={endsAt}
        onChangeText={setEndsAt}
        style={styles.input}
      />
      <TextInput label="Dia" value={dayLabel} onChangeText={setDayLabel} style={styles.input} />
      {error && <HelperText type="error">{error}</HelperText>}
      <Button mode="contained" onPress={handleSubmit} loading={loading}>
        Salvar evento
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

export default EventForm;
