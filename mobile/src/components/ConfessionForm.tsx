import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";

interface Props {
  onSubmit: (payload: {
    location?: string;
    starts_at: string;
    ends_at: string;
    priest?: string;
    notes?: string;
  }) => Promise<void>;
}

const ConfessionForm: React.FC<Props> = ({ onSubmit }) => {
  const [location, setLocation] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [priest, setPriest] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!startsAt || !endsAt) {
      setError("Início e fim são obrigatórios");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        location: location || undefined,
        starts_at: startsAt,
        ends_at: endsAt,
        priest: priest || undefined,
        notes: notes || undefined,
      });
      setLocation("");
      setStartsAt("");
      setEndsAt("");
      setPriest("");
      setNotes("");
    } catch (e) {
      setError("Não foi possível salvar o horário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput label="Local" value={location} onChangeText={setLocation} style={styles.input} />
      <TextInput
        label="Início (ISO)"
        value={startsAt}
        onChangeText={setStartsAt}
        style={styles.input}
      />
      <TextInput label="Fim (ISO)" value={endsAt} onChangeText={setEndsAt} style={styles.input} />
      <TextInput label="Sacerdote" value={priest} onChangeText={setPriest} style={styles.input} />
      <TextInput label="Observações" value={notes} onChangeText={setNotes} style={styles.input} multiline />
      {error && <HelperText type="error">{error}</HelperText>}
      <Button mode="contained" onPress={handleSubmit} loading={loading}>
        Salvar horário
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

export default ConfessionForm;
