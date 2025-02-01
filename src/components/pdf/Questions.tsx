import { View, Text, StyleSheet } from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  question: {
    marginBottom: 5,
    fontSize: 16,
  },
  optionsContainer: {
    // marginLeft: 10,
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

interface Style {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  marginBottom?: number;
}

// Checkbox Question
interface CheckboxQuestionProps {
  question: string;
  options?: string[];
  index: number;
  colorTheme?: string;
  questionStyle?: Style;
}

export const CheckboxQuestion = ({
  question,
  options,
  index,
  colorTheme = "#000",
  questionStyle,
}: CheckboxQuestionProps) => (
  <View style={styles.container}>
    {/* <Text style={styles.question}>
      {index}. {question}
    </Text> */}
    <View style={[styles.optionsContainer, questionStyle as Style]}>
      {options?.map((option, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.checkbox, { borderColor: colorTheme }]} />
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
  colorTheme?: string;
  questionStyle?: Style;
}

export const MultipleChoiceQuestion = ({
  question,
  options,
  index,
  colorTheme = "#000",
  questionStyle,
}: MultipleChoiceQuestionProps) => (
  <View style={styles.container}>
    {/* <Text style={styles.question}>
      {index}. {question}
    </Text> */}
    <View style={[styles.optionsContainer, questionStyle as Style]}>
      {options?.map((option, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.radio, { borderColor: colorTheme }]} />
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
  colorTheme?: string;
  questionStyle?: Style;
}

export const SingleChoiceQuestion = ({
  question,
  options,
  index,
  colorTheme = "#000",
  questionStyle,
}: SingleChoiceQuestionProps) => (
  <View style={styles.container}>
    {/* <Text style={styles.question}>
      {index}. {question}
    </Text> */}
    <View style={[styles.optionsContainer, questionStyle as Style]}>
      {options?.map((option, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.radio, { borderColor: colorTheme }]} />
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
  colorTheme?: string;
  questionStyle?: Style;
}

export const DropdownQuestion = ({
  question,
  options,
  index,
  colorTheme = "#000",
  questionStyle,
}: DropdownQuestionProps) => (
  <View style={styles.container}>
    {/* <Text style={styles.question}>
      {index}. {question}
    </Text> */}
    <View style={[styles.optionsContainer, questionStyle as Style]}>
      {options?.map((option, i) => (
        <View key={i} style={styles.row}>
          <View style={[styles.checkbox, { borderColor: colorTheme }]} />
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
  colorTheme?: string;
  questionStyle?: Style;
}

export const BooleanQuestion = ({
  question,
  index,
  colorTheme = "#000",
  questionStyle,
}: BooleanQuestionProps) => (
  <View style={styles.container}>
    {/* <Text style={styles.question}>
      {index}. {question}
    </Text> */}
    <View style={[styles.row, questionStyle as Style]}>
      <View style={[styles.radio, { borderColor: colorTheme }]} />
      <Text>True</Text>
    </View>
    <View style={styles.row}>
      <View style={[styles.radio, { borderColor: colorTheme }]} />
      <Text>False</Text>
    </View>
  </View>
);

// Short Text Question
interface ShortTextQuestionProps {
  question: string;
  index: number;
  colorTheme?: string;
  questionStyle?: Style;
}

export const ShortTextQuestion = ({
  question,
  index,
  colorTheme = "#000",
  questionStyle,
}: ShortTextQuestionProps) => (
  <View style={styles.container}>
    {/* <Text style={styles.question}>
      {index}. {question}
    </Text> */}
    <View style={[styles.optionsContainer, questionStyle as Style]}>
      <View
        style={[
          {
            borderBottomWidth: 1,
            borderBottomColor: "#000",
            width: "100%",
            marginTop: 5,
          },
          { borderColor: colorTheme },
        ]}
      />
    </View>
  </View>
);

// Long Text Question
interface LongTextQuestionProps {
  question: string;
  index: number;
  colorTheme?: string;
  questionStyle?: Style;
}

export const LongTextQuestion = ({
  question,
  index,
  colorTheme = "#000",
  questionStyle,
}: LongTextQuestionProps) => (
  <View style={styles.container}>
    {/* <Text style={styles.question}>
      {index}. {question}
    </Text> */}
    {/* <Text>_________________________________________</Text> */}
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: "black",
          padding: 8,
          minHeight: 100,
          marginTop: 5,
          borderRadius: 4,
        },
        { borderColor: colorTheme },
        questionStyle as Style,
      ]}
    ></View>
  </View>
);

// Slider Question
interface SliderQuestionProps {
  question: string;
  index: number;
  colorTheme?: string;
  questionStyle?: Style;
}

export const SliderQuestion = ({
  question,
  index,
  colorTheme,
  questionStyle,
}: SliderQuestionProps) => (
  <View style={styles.container}>
    {/* <Text style={styles.question}>
      {index}. {question}
    </Text> */}
    <View style={styles.sliderContainer}>
      <View style={[styles.sliderLine, { backgroundColor: colorTheme }]} />
      <View style={[styles.sliderMarkers, questionStyle as Style]}>
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
  colorTheme?: string;
  questionStyle?: Style;
}

export const LikertScaleQuestion = ({
  question,
  options,
  index,
  colorTheme = "#000",
  questionStyle,
}: LikertScaleQuestionProps) => (
  <View style={styles.container}>
    {/* <Text style={styles.question}>
      {index}. {question}
    </Text> */}
    <View style={styles.likertContainer}>
      {options?.map((option, i) => (
        <View key={i} style={styles.likertOption}>
          <View style={[styles.radio, { borderColor: colorTheme }]} />
          <Text style={[questionStyle as Style]}>{option}</Text>
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
  colorTheme?: string;
  questionStyle?: Style;
}

export const RatingScaleQuestion = ({
  question,
  options,
  index,
  colorTheme = "#000",
  questionStyle,
}: RatingScaleQuestionProps) => {
  const range = options
    ? options
    : Array.from({ length: 5 }, (_, i) => (i + 1).toString());

  return (
    <View style={styles.container}>
      {/* <Text style={styles.question}>
        {index}. {question}
      </Text> */}
      <View style={styles.likertContainer}>
        {range.map((rating, i) => (
          <View key={i} style={styles.likertOption}>
            <View style={[styles.radio, { borderColor: colorTheme }]} />
            <Text style={[questionStyle as Style]}>{rating}</Text>
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
  colorTheme?: string;
  questionStyle?: Style;
}

export const StarRatingQuestion = ({
  question,
  index,
  colorTheme = "#000",
  questionStyle,
}: StarRatingQuestionProps) => (
  <View style={styles.container}>
    {/* <Text style={styles.question}>
      {index}. {question}
    </Text> */}
    <View style={styles.starContainer}>
      {[1, 2, 3, 4, 5].map((_, i) => (
        <Text
          key={i}
          style={[styles.star, { color: colorTheme }, questionStyle as Style]}
        >
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
  colorTheme?: string;
  questionStyle?: Style;
}

export const MatrixMultipleChoiceQuestion = ({
  question,
  rows,
  columns,
  index,
  colorTheme = "#000",
  questionStyle,
}: MatrixMultipleChoiceQuestionProps) => (
  <View style={styles.container}>
    {/* <Text style={styles.question}>
      {index}. {question}
    </Text> */}
    <View style={styles.matrixContainer}>
      <View style={styles.matrixHeader}>
        <View style={styles.matrixRowLabel} />
        {columns?.map((col, i) => (
          <View key={i} style={styles.matrixCell}>
            <Text style={[questionStyle as Style]}>{col}</Text>
          </View>
        ))}
      </View>
      {rows?.map((row, i) => (
        <View key={i} style={styles.matrixRow}>
          <View style={styles.matrixRowLabel}>
            <Text style={[questionStyle as Style]}>{row}</Text>
          </View>
          {columns?.map((_, j) => (
            <View key={j} style={styles.matrixCell}>
              <View style={[styles.radio, { borderColor: colorTheme }]} />
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
  colorTheme?: string;
  questionStyle?: Style;
}

export const MatrixCheckboxQuestion = ({
  question,
  rows,
  columns,
  index,
  colorTheme = "#000",
  questionStyle,
}: MatrixCheckboxQuestionProps) => (
  <View style={styles.container}>
    {/* <Text style={styles.question}>
      {index}. {question}
    </Text> */}
    <View style={styles.matrixContainer}>
      <View style={styles.matrixHeader}>
        <View style={styles.matrixRowLabel} />
        {columns?.map((col, i) => (
          <View key={i} style={styles.matrixCell}>
            <Text style={[questionStyle as Style]}>{col}</Text>
          </View>
        ))}
      </View>
      {rows?.map((row, i) => (
        <View key={i} style={styles.matrixRow}>
          <View style={styles.matrixRowLabel}>
            <Text style={[questionStyle as Style]}>{row}</Text>
          </View>
          {columns?.map((_, j) => (
            <View key={j} style={styles.matrixCell}>
              <View style={[styles.checkbox, { borderColor: colorTheme }]} />
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
  colorTheme?: string;
  questionStyle?: Style;
}

export const NumberQuestion = ({
  question,
  index,
  colorTheme = "#000",
  questionStyle,
}: NumberQuestionProps) => (
  <View style={styles.container}>
    {/* <Text style={styles.question}>
      {index}. {question}
    </Text> */}
    <View style={[{ marginTop: 10 }, { borderColor: colorTheme }]}>
      <View
        style={[
          {
            borderBottomWidth: 1,
            borderBottomColor: "#000",
            width: "100%",
            marginTop: 5,
          },
          { borderColor: colorTheme },
        ]}
      />
    </View>
  </View>
);
