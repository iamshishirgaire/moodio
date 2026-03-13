import type React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { FilterPill } from "@/components/ui/filter-pill";
import { theme } from "@/constants/theme";

type Props = {
  activeFilter: string;
  onChange: (value: string) => void;
  options: string[];
};

const LibraryFilterRow: React.FC<Props> = ({ activeFilter, onChange, options }) => {
  return (
    <View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {options.map((filter) => (
          <FilterPill
            isActive={activeFilter === filter}
            key={filter}
            onPress={() => onChange(filter)}
            title={filter}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
});

export default LibraryFilterRow;
