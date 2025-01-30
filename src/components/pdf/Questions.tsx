import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  question: {
    marginBottom: 5,
    fontSize: 14,
  },
  optionsContainer: {
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: "black",
    marginRight: 5,
  },
  radio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "black",
    marginRight: 5,
  },
  likertContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  likertOption: {
    alignItems: "center",
  },
  matrixContainer: {
    marginTop: 10,
  },
  matrixHeader: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 100, // Space for row labels
  },
  matrixRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  matrixRowLabel: {
    width: 100,
  },
  matrixCell: {
    flex: 1,
    alignItems: "center",
  },
  sliderContainer: {
    marginTop: 10,
  },
  sliderLine: {
    height: 2,
    backgroundColor: "#000",
    marginVertical: 5,
  },
  sliderMarkers: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  starContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  star: {
    fontSize: 16,
    color: "black",
    marginRight: 2,
  },
});

// Checkbox Question
interface CheckboxQuestionProps {
  question: string;
  options?: string[];
  index: number;
}

export const CheckboxQuestion = ({
  question,
  options,
  index,
}: CheckboxQuestionProps) => (
  <View style={styles.container}>
    <Text style={styles.question}>
      {index}. {question}
    </Text>
    <View style={styles.optionsContainer}>
      {options?.map((option, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.checkbox} />
          <Text>{option}</Text>
        </View>
      ))}
    </View>
  </View>
);

// Multiple Choice Question
interface MultipleChoiceQuestionProps {
  question: string;
  options?: string[];
  index: number;
}

export const MultipleChoiceQuestion = ({
  question,
  options,
  index,
}: MultipleChoiceQuestionProps) => (
  <View style={styles.container}>
    <Text style={styles.question}>
      {index}. {question}
    </Text>
    <View style={styles.optionsContainer}>
      {options?.map((option, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.radio} />
          <Text>{option}</Text>
        </View>
      ))}
    </View>
  </View>
);

// Single Choice Question
interface SingleChoiceQuestionProps {
  question: string;
  options?: string[];
  index: number;
}

export const SingleChoiceQuestion = ({
  question,
  options,
  index,
}: SingleChoiceQuestionProps) => (
  <View style={styles.container}>
    <Text style={styles.question}>
      {index}. {question}
    </Text>
    <View>
      {options?.map((option, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.radio} />
          <Text>{option}</Text>
        </View>
      ))}
    </View>
  </View>
);

// Dropdown Question
interface DropdownQuestionProps {
  question: string;
  options?: string[];
  index: number;
}

export const DropdownQuestion = ({
  question,
  options,
  index,
}: DropdownQuestionProps) => (
  <View style={styles.container}>
    <Text style={styles.question}>
      {index}. {question}
    </Text>
    <View style={styles.optionsContainer}>
      {options?.map((option, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.checkbox} />
          <Text>{option}</Text>
        </View>
      ))}
    </View>
  </View>
);

// Boolean Question
interface BooleanQuestionProps {
  question: string;
  index: number;
}

export const BooleanQuestion = ({ question, index }: BooleanQuestionProps) => (
  <View style={styles.container}>
    <Text style={styles.question}>
      {index}. {question}
    </Text>
    <View style={styles.row}>
      <View style={styles.radio} />
      <Text>True</Text>
    </View>
    <View style={styles.row}>
      <View style={styles.radio} />
      <Text>False</Text>
    </View>
  </View>
);

// Short Text Question
interface ShortTextQuestionProps {
  question: string;
  index: number;
}

export const ShortTextQuestion = ({
  question,
  index,
}: ShortTextQuestionProps) => (
  <View style={styles.container}>
    <Text style={styles.question}>
      {index}. {question}
    </Text>
    <Text>_________________________________________</Text>
  </View>
);

// Long Text Question
interface LongTextQuestionProps {
  question: string;
  index: number;
}

export const LongTextQuestion = ({
  question,
  index,
}: LongTextQuestionProps) => (
  <View style={styles.container}>
    <Text style={styles.question}>
      {index}. {question}
    </Text>
    <Text>_________________________________________</Text>
  </View>
);

// Slider Question
interface SliderQuestionProps {
  question: string;
  index: number;
}

export const SliderQuestion = ({ question, index }: SliderQuestionProps) => (
  <View style={styles.container}>
    <Text style={styles.question}>
      {index}. {question}
    </Text>
    <View style={styles.sliderContainer}>
      <View style={styles.sliderLine} />
      <View style={styles.sliderMarkers}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <Text key={num}>{num}</Text>
        ))}
      </View>
    </View>
  </View>
);

// Likert Scale Question
interface LikertScaleQuestionProps {
  question: string;
  options?: string[];
  index: number;
}

export const LikertScaleQuestion = ({
  question,
  options,
  index,
}: LikertScaleQuestionProps) => (
  <View style={styles.container}>
    <Text style={styles.question}>
      {index}. {question}
    </Text>
    <View style={styles.likertContainer}>
      {options?.map((option, i) => (
        <View key={i} style={styles.likertOption}>
          <View style={styles.radio} />
          <Text>{option}</Text>
        </View>
      ))}
    </View>
  </View>
);

// Rating Scale Question
interface RatingScaleQuestionProps {
  question: string;
  options?: string[];
  index: number;
}

export const RatingScaleQuestion = ({
  question,
  options,
  index,
}: RatingScaleQuestionProps) => {
  const range = options
    ? options
    : Array.from({ length: 5 }, (_, i) => (i + 1).toString());

  return (
    <View style={styles.container}>
      <Text style={styles.question}>
        {index}. {question}
      </Text>
      <View style={styles.likertContainer}>
        {range.map((rating, i) => (
          <View key={i} style={styles.likertOption}>
            <View style={styles.radio} />
            <Text>{rating}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Star Rating Question
interface StarRatingQuestionProps {
  question: string;
  index: number;
}

export const StarRatingQuestion = ({
  question,
  index,
}: StarRatingQuestionProps) => (
  <View style={styles.container}>
    <Text style={styles.question}>
      {index}. {question}
    </Text>
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((_, i) => (
        <Text key={i} style={styles.star}>
          ★
        </Text>
      ))}
    </View>
  </View>
);

// Matrix Multiple Choice Question
interface MatrixMultipleChoiceQuestionProps {
  question: string;
  rows?: string[];
  columns?: string[];
  index: number;
}

export const MatrixMultipleChoiceQuestion = ({
  question,
  rows,
  columns,
  index,
}: MatrixMultipleChoiceQuestionProps) => (
  <View style={styles.container}>
    <Text style={styles.question}>
      {index}. {question}
    </Text>
    <View style={styles.matrixContainer}>
      <View style={styles.matrixHeader}>
        <View style={styles.matrixRowLabel} />
        {columns?.map((col, i) => (
          <View key={i} style={styles.matrixCell}>
            <Text>{col}</Text>
          </View>
        ))}
      </View>
      {rows?.map((row, i) => (
        <View key={i} style={styles.matrixRow}>
          <View style={styles.matrixRowLabel}>
            <Text>{row}</Text>
          </View>
          {columns?.map((_, j) => (
            <View key={j} style={styles.matrixCell}>
              <View style={styles.radio} />
            </View>
          ))}
        </View>
      ))}
    </View>
  </View>
);

// Matrix Checkbox Question
interface MatrixCheckboxQuestionProps {
  question: string;
  rows?: string[];
  columns?: string[];
  index: number;
}

export const MatrixCheckboxQuestion = ({
  question,
  rows,
  columns,
  index,
}: MatrixCheckboxQuestionProps) => (
  <View style={styles.container}>
    <Text style={styles.question}>
      {index}. {question}
    </Text>
    <View style={styles.matrixContainer}>
      <View style={styles.matrixHeader}>
        <View style={styles.matrixRowLabel} />
        {columns?.map((col, i) => (
          <View key={i} style={styles.matrixCell}>
            <Text>{col}</Text>
          </View>
        ))}
      </View>
      {rows?.map((row, i) => (
        <View key={i} style={styles.matrixRow}>
          <View style={styles.matrixRowLabel}>
            <Text>{row}</Text>
          </View>
          {columns?.map((_, j) => (
            <View key={j} style={styles.matrixCell}>
              <View style={styles.checkbox} />
            </View>
          ))}
        </View>
      ))}
    </View>
  </View>
);

// Number Question
interface NumberQuestionProps {
  question: string;
  index: number;
}

export const NumberQuestion = ({ question, index }: NumberQuestionProps) => (
  <View style={styles.container}>
    <Text style={styles.question}>
      {index}. {question}
    </Text>
    <Text>- Answer: ___________</Text>
  </View>
);
