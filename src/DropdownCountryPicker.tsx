import React, { useEffect, useRef, useState } from "react";
import Flag from "react-native-country-flag";
import {
  FlatList,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import Text from "../src/Components/Text";
import TextInput from "../src/Components/TextInput";
import { CountryCodes, CountryNames } from "./data";
import * as AllFunctions from "./functions";
import { RenderComProp, RProps } from "rn-country-dropdown-picker";

export default function DropdownCountyPicker({
  ContainerStyle,
  InputFieldStyle,
  DropdownCountryTextStyle,
  DropdownContainerStyle,
  DropdownRowStyle,
  countryNameStyle,
  flagSize,
  Placeholder,
  selectedItem,
  resetKey, // Change from 'reset' to 'resetKey' as a unique identifier
}: RProps & { resetKey: string }) {
  const [term, setTerm] = useState<string>("");
  const [iso, setISO] = useState<string>("");
  const [Fheight, setFheight] = useState<number>(250);
  const [opacity, setOpacity] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(false);

  const filteredCodes = useRef<string[]>();

  useEffect(() => {
    setTerm("");            // Clear the input
    setISO("");             // Clear the selected ISO
    setFheight(0);          // Close the dropdown
    setOpacity(0);          // Hide the dropdown
    filteredCodes.current = CountryCodes; // Reset the filtered codes
    setRefresh(prev => !prev);  // Trigger re-render
    selectedItem({ country: "", code: "" }); // Reset the selected item
  }, [resetKey]);  // Dependency on resetKey change
  

  const DropdownContainerStyleDefault: object = {
    opacity,
    width: "100%",
    borderWidth: 0.5,
    borderTopWidth: 0,
    borderBottomWidth: Fheight > 0 ? 0.5 : 0,
    maxHeight: Fheight,
  };

  const renderItem: React.FC<RenderComProp> = ({ item }) => {
    const name = AllFunctions.getName(item);

    function CountrySelected(item: string) {
      const name = AllFunctions.getName(item);
      if (name) {
        setISO(item);
        setTerm(name);
        selectedItem({ country: name, code: item });
        setFheight(0);
      }
    }

    return (
      <TouchableOpacity
        style={{ elevation: 10, zIndex: 10 }}
        activeOpacity={0.8}
        onPress={() => CountrySelected(item)}
      >
        <View
          style={
            DropdownRowStyle
              ? [DropdownRowStyle, styles.RowStyleDefault]
              : [styles.RowView, styles.RowStyleDefault]
          }
        >
          <Flag isoCode={item} size={flagSize || 24} />
          <Text
            style={
              DropdownCountryTextStyle
                ? DropdownCountryTextStyle
                : styles.DropdownCountryTextStyle
            }
          >
            {name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const searchFilter = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const input = e.nativeEvent.text;
    setTerm(input);
    setISO("");
    if (input.length > 0) {
      setFheight(250);
      setOpacity(1);
    } else {
      setFheight(0);
      setOpacity(0);
    }
    const convertedCodes: string[] = [];
    const res = CountryNames.filter((item) =>
      item.toLowerCase().includes(input.toLowerCase())
    );
    res.forEach((e) => {
      const code = AllFunctions.getCode(e);
      convertedCodes.push(code!);
    });
    filteredCodes.current = convertedCodes;
    setRefresh(prev => !prev);
  };

  return (
    <View style={ContainerStyle ? ContainerStyle : styles.viewStyle}>
      <View
        style={
          InputFieldStyle
            ? [InputFieldStyle, styles.InputFieldDefault]
            : styles.InputField
        }
      >
        {CountryCodes.includes(iso) && CountryNames.includes(term) ? (
          <Flag isoCode={iso} size={24} />
        ) : null}
        <TextInput
          style={
            countryNameStyle
              ? countryNameStyle
              : [
                  styles.countryNameStyle,
                  {
                    paddingStart:
                      CountryCodes.includes(iso) && CountryNames.includes(term)
                        ? 20
                        : 0,
                  },
                ]
          }
          placeholder={Placeholder || "Select Country..."}
          placeholderTextColor="black"
          value={term}
          onChange={searchFilter}
        />
      </View>
      <FlatList
        style={
          DropdownContainerStyle
            ? [DropdownContainerStyle, DropdownContainerStyleDefault]
            : [DropdownContainerStyleDefault]
        }
        data={
          filteredCodes.current === null ? CountryCodes : filteredCodes.current
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        extraData={refresh}
        keyboardShouldPersistTaps="always"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 10,
    width: "100%",
  },
  InputField: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 6,
    borderBottomWidth: 1,
  },
  InputFieldDefault: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  DropdownCountryTextStyle: {
    fontSize: 20,
    marginVertical: 5,
    width: "100%",
    paddingStart: 15,
    color: "black",
  },
  RowView: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    justifyContent: "flex-start",
    paddingHorizontal: 7,
    width: "100%",
  },
  countryNameStyle: {
    paddingVertical: 8,
    fontSize: 18,
    paddingStart: 10,
    flex: 1,
    color: "black",
  },
  RowStyleDefault: { flexDirection: "row", alignItems: "center" },
});