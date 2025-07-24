import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
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

Font.register({
  family: "Helvetica-custom",
  src: "/fonts/DMSans-Variable.ttf",
});

// Define default styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "row", // Add sidebar
    padding: 0,
    margin: 0,
    backgroundColor: "#FFFFFF", // Subtle background
    fontFamily: "Helvetica-custom",
    paddingVertical: 32, // Added vertical padding
  },
  sidebar: {
    width: 12,
    height: "100%",
    fontFamily: "Helvetica-custom",
  },
  content: {
    flex: 1,
    flexDirection: "column",
    padding: 32,
    fontFamily: "Helvetica-custom",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 1.2,
    fontFamily: "Helvetica-custom",
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
    lineHeight: 1.5,
    fontFamily: "Helvetica-custom",
  },
  section: {
    marginBottom: 28,
    fontFamily: "Helvetica-custom",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 12,
    fontFamily: "Helvetica-custom",
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: 8,
    borderRadius: 8,
    fontFamily: "Helvetica-custom",
  },
  banner: {
    width: "100%",
    height: 96,
    marginBottom: 20,
    borderRadius: 8,
    objectFit: "cover",
    fontFamily: "Helvetica-custom",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(90,0,180,0.07)",
    padding: 18,
    marginBottom: 18,
    fontFamily: "Helvetica-custom",
  },
  question: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    letterSpacing: 0.5,
    fontFamily: "Helvetica-custom",
  },
  divider: {
    height: 2,
    opacity: 0.12,
    marginVertical: 18,
    borderRadius: 1,
    fontFamily: "Helvetica-custom",
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
  nameAndEmail: {
    email: boolean;
    name: boolean;
  };
}

interface TextStyle {
  name: string;
  size: string | number;
}

const SurveyPDFDocument = ({
  surveyData,
  nameAndEmail,
}: SurveyPDFDocumentProps) => {
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

  // Dynamic styles using black and white only
  const dynamicStyles = StyleSheet.create({
    sidebar: {
      width: 12,
      backgroundColor: "#222", // dark gray sidebar
      height: "100%",
    },
    content: {
      flex: 1,
      flexDirection: "column",
      padding: 32,
    },
    header: {
      fontSize: 26,
      fontWeight: "normal",
      marginBottom: 8,
      color: "#111",
      letterSpacing: 1.2,
    },
    logo: {
      width: 72,
      height: 72,
      marginBottom: 8,
      borderRadius: 8,
      border: "2px solid #111",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 10,
      boxShadow: "0 2px 8px #00000012",
      border: "1px solid #222",
      padding: 18,
      marginBottom: 18,
    },
    question: {
      fontSize: 14,
      fontWeight: "normal",
      marginBottom: 10,
      color: "#111",
      letterSpacing: 0.5,
    },
    divider: {
      height: 2,
      backgroundColor: "#222",
      opacity: 0.12,
      marginVertical: 18,
      borderRadius: 1,
    },
  });

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
      <Page wrap={true} size="A4" style={styles.page}>
        <View style={dynamicStyles.sidebar} />
        <View style={dynamicStyles.content}>
          {/* Logo */}
          {logo_url && (
            <View style={styles.logoContainer}>
              <Image src={logo_url} style={dynamicStyles.logo} />
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
            <Text style={dynamicStyles.header as any}>{topic}</Text>
            <Text style={styles.description as any}>{description}</Text>
          </View>

          {/* Name and Email Section */}
          {(nameAndEmail.name || nameAndEmail.email) && (
            <View style={styles.section}>
              <View style={dynamicStyles.card}>
                {nameAndEmail.name && (
                  <>
                    <Text style={dynamicStyles.question as any}>Name:</Text>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        minHeight: 24,
                        borderRadius: 4,
                        marginTop: 4,
                        marginBottom: 12,
                        padding: 6,
                      }}
                    />
                  </>
                )}
                {nameAndEmail.email && (
                  <>
                    <Text style={dynamicStyles.question as any}>Email:</Text>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        minHeight: 24,
                        borderRadius: 4,
                        marginTop: 4,
                        marginBottom: 12,
                        padding: 6,
                      }}
                    />
                  </>
                )}
              </View>
            </View>
          )}

          {/* All sections and questions */}
          {sections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              {/* Divider before all but the first section */}
              {sectionIndex > 0 && <View style={dynamicStyles.divider} />}
              {/* Section header: topic/description or generic */}
              {(section as any)?.section_topic ||
              (section as any)?.section_description ? (
                <View style={{ marginBottom: 12 }}>
                  {(section as any)?.section_topic && (
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginBottom: 4,
                      }}
                    >
                      {(section as any)?.section_topic}
                    </Text>
                  )}
                  {(section as any)?.section_description && (
                    <Text
                      style={{ fontSize: 14, color: "#666", marginBottom: 4 }}
                    >
                      {(section as any)?.section_description}
                    </Text>
                  )}
                </View>
              ) : sectionIndex !== 0 ? (
                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#5B03B2",
                    }}
                  >
                    Section {sectionIndex + 1}
                  </Text>
                </View>
              ) : (
                <View></View>
              )}
              {section.questions.map((item, index) => (
                <View
                  key={`${sectionIndex}-${index}`}
                  style={dynamicStyles.card}
                >
                  <Text style={dynamicStyles.question as any}>
                    <Text style={{ color: "#111", fontWeight: "normal" }}>
                      {index + 1}.
                    </Text>{" "}
                    {item.question}
                  </Text>
                  {item.question_type === "checkbox" ? (
                    <CheckboxQuestion
                      question={item.question}
                      options={item.options}
                      index={index + 1}
                      colorTheme="#111"
                      questionStyle={dynamicStyles.question}
                    />
                  ) : item.question_type === "multiple_choice" ? (
                    <MultipleChoiceQuestion
                      question={item.question}
                      options={item.options}
                      index={index + 1}
                      colorTheme="#111"
                      questionStyle={dynamicStyles.question}
                    />
                  ) : item.question_type === "single_choice" ? (
                    <SingleChoiceQuestion
                      question={item.question}
                      options={item.options}
                      index={index + 1}
                      colorTheme="#111"
                      questionStyle={dynamicStyles.question}
                    />
                  ) : item.question_type === "drop_down" ? (
                    <DropdownQuestion
                      question={item.question}
                      options={item.options}
                      index={index + 1}
                      colorTheme="#111"
                      questionStyle={dynamicStyles.question}
                    />
                  ) : item.question_type === "boolean" ? (
                    <BooleanQuestion
                      question={item.question}
                      index={index + 1}
                      colorTheme="#111"
                      questionStyle={dynamicStyles.question}
                    />
                  ) : item.question_type === "short_text" ? (
                    <ShortTextQuestion
                      question={item.question}
                      index={index + 1}
                      colorTheme="#111"
                      questionStyle={dynamicStyles.question}
                    />
                  ) : item.question_type === "long_text" ? (
                    <LongTextQuestion
                      question={item.question}
                      index={index + 1}
                      colorTheme="#111"
                      questionStyle={dynamicStyles.question}
                    />
                  ) : item.question_type === "slider" ? (
                    <SliderQuestion
                      question={item.question}
                      index={index + 1}
                      colorTheme="#111"
                      questionStyle={dynamicStyles.question}
                      min={(item as any).min}
                      max={(item as any).max}
                    />
                  ) : item.question_type === "likert_scale" ? (
                    <LikertScaleQuestion
                      question={item.question}
                      options={item.options}
                      index={index + 1}
                      colorTheme="#111"
                      questionStyle={dynamicStyles.question}
                    />
                  ) : item.question_type === "rating_scale" ? (
                    <RatingScaleQuestion
                      question={item.question}
                      options={item.options}
                      index={index + 1}
                      colorTheme="#111"
                      questionStyle={dynamicStyles.question}
                    />
                  ) : item.question_type === "star_rating" ? (
                    <StarRatingQuestion
                      question={item.question}
                      index={index + 1}
                      colorTheme="#111"
                      questionStyle={dynamicStyles.question}
                      useCircles={true}
                    />
                  ) : item.question_type === "matrix_multiple_choice" ? (
                    <MatrixMultipleChoiceQuestion
                      question={item.question}
                      rows={item.rows}
                      columns={item.columns}
                      index={index + 1}
                      colorTheme="#111"
                      questionStyle={dynamicStyles.question}
                    />
                  ) : item.question_type === "matrix_checkbox" ? (
                    <MatrixCheckboxQuestion
                      question={item.question}
                      rows={item.rows}
                      columns={item.columns}
                      index={index + 1}
                      colorTheme="#111"
                      questionStyle={dynamicStyles.question}
                    />
                  ) : item.question_type === "number" ? (
                    <NumberQuestion
                      question={item.question}
                      index={index + 1}
                      colorTheme="#111"
                      questionStyle={dynamicStyles.question}
                    />
                  ) : null}
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default SurveyPDFDocument;
