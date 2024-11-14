import React, { useEffect, useRef, useState } from "react";
import Flag from "react-native-country-flag";
import {
  FlatList,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import Text from "../../../src/components/Text";
import TextInput from "../../../src/components/TextInput";
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
  PlaceholderTextColor,
  selectedItem,
  initialValue,
  resetKey, // Change from 'reset' to 'resetKey' as a unique identifier
}: RProps & { resetKey: string }) {
  const [term, setTerm] = useState<string>("");
  const [iso, setISO] = useState<string>(initialValue || "");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const filteredCodes = useRef<string[]>(CountryCodes);

  useEffect(() => {
    if (initialValue) {
      const name = AllFunctions.getName(initialValue);
      setISO(initialValue);
      setTerm(name);
      selectedItem({ country: name, code: initialValue });
    }
  }, [initialValue]);

  useEffect(() => {
    setTerm("");            // Clear the input
    setISO("");             // Clear the selected ISO
    setIsOpen(false);       // Close the dropdown
    filteredCodes.current = CountryCodes; // Reset the filtered codes
    setRefresh(prev => !prev);  // Trigger re-render
    selectedItem({ country: "", code: "" }); // Reset the selected item
  }, [resetKey]);  // Dependency on resetKey change

  const DropdownContainerStyleDefault: object = {
    maxHeight: isOpen ? 250 : 0,
    overflow: "hidden",
    opacity: isOpen ? 1 : 0,
    width: "100%",
    borderWidth: isOpen ? 0.5 : 0,
  };

  const renderItem: React.FC<RenderComProp> = ({ item }) => {
    const name = AllFunctions.getName(item);

    function CountrySelected(item: string) {
      const name = AllFunctions.getName(item);
      if (name) {
        setISO(item);
        setTerm(name);
        selectedItem({ country: name, code: item });
        setIsOpen(false);
      }
    }

    return (
      <TouchableOpacity
        style={[
          {
            width: '100%',
            minHeight: 44,
          },
          Platform.select({
            ios: {
              backgroundColor: 'transparent',
            }
          })
        ]}
        activeOpacity={0.8}
        onPress={() => {
          console.log('Country selected:', item);
          CountrySelected(item);
        }}
      >
        <View
          style={[
            DropdownRowStyle
              ? [DropdownRowStyle, styles.RowStyleDefault]
              : [styles.RowView, styles.RowStyleDefault],
            { minHeight: 44,
              width: '100%'
             }
          ]}
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
      setIsOpen(true); // Open dropdown when input has text
    } else {
      setIsOpen(false); // Close dropdown when input is cleared
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
        {iso ? (
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
                      iso
                        ? 20
                        : 0,
                  },
                ]
          }
          placeholder={Placeholder || "Select Country..."}
          placeholderTextColor={PlaceholderTextColor || "black"}
          value={term}
          onChange={searchFilter}
          onFocus={() => setIsOpen(true)} // Open dropdown on focus
          onBlur={() => setIsOpen(false)} // Close dropdown on blur
        />
      </View>
      <FlatList
        style={[
          DropdownContainerStyle
            ? [DropdownContainerStyle, DropdownContainerStyleDefault]
            : [DropdownContainerStyleDefault],
          Platform.select({
            ios: {
              zIndex: 999
            }
          })
        ]}
        data={filteredCodes.current}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        extraData={refresh}
        nestedScrollEnabled={true}
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