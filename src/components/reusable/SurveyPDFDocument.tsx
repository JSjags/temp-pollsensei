import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import {
  BooleanQuestion,
  DropdownQuestion,
  LikertScaleQuestion,
  LongTextQuestion,
  MatrixMultipleChoiceQuestion,
  MultipleChoiceQuestion,
  RatingScaleQuestion,
  ShortTextQuestion,
  SliderQuestion,
  MatrixCheckboxQuestion,
  NumberQuestion,
  StarRatingQuestion,
  SingleChoiceQuestion,
  CheckboxQuestion,
} from "../pdf/Questions";

// Define default styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    margin: 0, // Ensure no margin at top
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    color: "#5B03B2",
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    color: "#666",
  },
  question: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  section: {
    marginBottom: 20,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 10,
    marginTop: 0, // Ensure no margin at top
  },
  banner: {
    width: "100%",
    height: 96,
    marginBottom: 20,
    marginTop: 0, // Ensure no margin at top
  },
});

interface SurveyPDFDocumentProps {
  surveyData: {
    logo_url?: string | null;
    header_url?: string | null;
    topic?: string;
    description?: string;
    sections: {
      questions: {
        question: string;
        question_type: string;
        options?: string[];
        rows?: string[];
        columns?: string[];
        is_required?: boolean;
      }[];
    }[];
    theme: string;
    header_text: TextStyle | null;
    question_text: TextStyle | null;
    body_text: TextStyle | null;
    color_theme: string;
  };
}

interface TextStyle {
  name: string;
  size: string | number;
}

const SurveyPDFDocument = ({ surveyData }: SurveyPDFDocumentProps) => {
  if (!surveyData) {
    return null;
  }

  // Destructure theme and text styles
  const {
    theme,
    header_text,
    question_text,
    body_text,
    color_theme,
    logo_url,
    header_url,
    topic,
    description,
    sections,
  } = surveyData;

  interface Style {
    fontSize?: number;
    color?: string;
    marginBottom?: number;
  }

  // Default styles if not provided
  const headerStyle: Style = {
    fontSize:
      typeof question_text?.size === "string"
        ? parseInt(question_text.size)
        : question_text?.size || 24,
    color: "#5B03B2",
    marginBottom: 10,
  };

  const descriptionStyle: Style = {
    fontSize:
      typeof question_text?.size === "string"
        ? parseInt(question_text.size)
        : question_text?.size || 14,
    color: "#666",
    marginBottom: 20,
  };

  const questionStyle: Style = {
    fontSize:
      typeof question_text?.size === "string"
        ? parseInt(question_text.size)
        : question_text?.size || 16,
    color: "#333",
    marginBottom: 10,
  };

  // Apply theme to the page background
  const pageStyle = {
    ...styles.page,
    backgroundImage:
      theme === "default"
        ? "url(../assets/images/default.svg)"
        : theme === "neon"
        ? "url(../assets/images/neon.svg)"
        : theme === "sparkly"
        ? "url(../assets/images/Sparkly.svg)"
        : undefined,
    backgroundRepeat: theme ? "no-repeat" : undefined,
    backgroundSize: theme ? "cover" : undefined,
    backgroundPosition: theme ? "center" : undefined,
    backgroundColor: !theme ? "#FFFFFF" : undefined,
  };

  return (
    <Document>
      <Page size="A4" style={pageStyle}>
        {/* Logo */}
        {logo_url && (
          <View style={styles.section}>
            <Image src={logo_url} style={styles.logo} />
          </View>
        )}

        {/* Header Banner */}
        {header_url && (
          <View style={styles.section}>
            <Image src={header_url} style={styles.banner} />
          </View>
        )}

        {/* Survey Topic */}
        <View style={styles.section}>
          <Text style={headerStyle}>{topic}</Text>
          <Text style={descriptionStyle}>{description}</Text>
        </View>

        {/* Questions */}
        {sections[0]?.questions?.map((item, index) => (
          <View key={index} style={styles.section}>
            <Text style={questionStyle}>
              {index + 1}. {item.question}
            </Text>
            {item.question_type === "checkbox" ? (
              <CheckboxQuestion
                question={item.question}
                options={item.options}
                index={index + 1}
                colorTheme={color_theme}
                questionStyle={questionStyle}
              />
            ) : item.question_type === "multiple_choice" ? (
              <MultipleChoiceQuestion
                question={item.question}
                options={item.options}
                index={index + 1}
                colorTheme={color_theme}
                questionStyle={questionStyle}
              />
            ) : item.question_type === "single_choice" ? (
              <SingleChoiceQuestion
                question={item.question}
                options={item.options}
                index={index + 1}
                colorTheme={color_theme}
                questionStyle={questionStyle}
              />
            ) : item.question_type === "drop_down" ? (
              <DropdownQuestion
                question={item.question}
                options={item.options}
                index={index + 1}
                colorTheme={color_theme}
                questionStyle={questionStyle}
              />
            ) : item.question_type === "boolean" ? (
              <BooleanQuestion
                question={item.question}
                index={index + 1}
                colorTheme={color_theme}
                questionStyle={questionStyle}
              />
            ) : item.question_type === "short_text" ? (
              <ShortTextQuestion
                question={item.question}
                index={index + 1}
                colorTheme={color_theme}
                questionStyle={questionStyle}
              />
            ) : item.question_type === "long_text" ? (
              <LongTextQuestion
                question={item.question}
                index={index + 1}
                colorTheme={color_theme}
                questionStyle={questionStyle}
              />
            ) : item.question_type === "slider" ? (
              <SliderQuestion
                question={item.question}
                index={index + 1}
                colorTheme={color_theme}
                questionStyle={questionStyle}
              />
            ) : item.question_type === "likert_scale" ? (
              <LikertScaleQuestion
                question={item.question}
                options={item.options}
                index={index + 1}
                colorTheme={color_theme}
                questionStyle={questionStyle}
              />
            ) : item.question_type === "rating_scale" ? (
              <RatingScaleQuestion
                question={item.question}
                options={item.options}
                index={index + 1}
                colorTheme={color_theme}
                questionStyle={questionStyle}
              />
            ) : item.question_type === "star_rating" ? (
              <StarRatingQuestion
                question={item.question}
                index={index + 1}
                colorTheme={color_theme}
                questionStyle={questionStyle}
              />
            ) : item.question_type === "matrix_multiple_choice" ? (
              <MatrixMultipleChoiceQuestion
                question={item.question}
                rows={item.rows}
                columns={item.columns}
                index={index + 1}
                colorTheme={color_theme}
                questionStyle={questionStyle}
              />
            ) : item.question_type === "matrix_checkbox" ? (
              <MatrixCheckboxQuestion
                question={item.question}
                rows={item.rows}
                columns={item.columns}
                index={index + 1}
                colorTheme={color_theme}
                questionStyle={questionStyle}
              />
            ) : item.question_type === "number" ? (
              <NumberQuestion
                question={item.question}
                index={index + 1}
                colorTheme={color_theme}
                questionStyle={questionStyle}
              />
            ) : null}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default SurveyPDFDocument;
