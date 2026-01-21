"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {useLanguage} from "@/context/LanguageContext";

interface DeviceFormProps {
    onSubmit: (values: { name: string; deviceType: string }) => void;
}

export default function DeviceForm({ onSubmit }: DeviceFormProps) {
    const { t } = useLanguage();

    const DeviceSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, t.minTwoCharacters)
            .max(20, t.maxTwentyCharacters)
            .required(t.nameRequired),
        deviceType: Yup.string()
            .required(t.typeRequired),
    });

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">{t.addNewDevice}</h3>

            <Formik
                initialValues={{ name: "", deviceType: "lightBulb" }}
                validationSchema={DeviceSchema}
                onSubmit={(values, { resetForm }) => {
                    onSubmit(values);
                    resetForm();
                }}
            >
                {({ isSubmitting }) => (
                    <Form className="flex flex-col gap-3">
                        {/* Nazwa */}
                        <div>
                            <Field
                                name="name"
                                placeholder={t.namePlaceholder}
                                className="w-full border p-2 rounded text-sm focus:border-blue-500 outline-none placeholder-gray-300 text-gray-700"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        <div>
                            <Field as="select" name="deviceType" className="w-full border p-2 rounded text-sm bg-white text-gray-700">
                                <option value="lightBulb">💡 {t.lightBulb}</option>
                                <option value="thermostat">🌡️ {t.thermostat}</option>
                            </Field>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium transition"
                        >
                            {isSubmitting ? t.adding : `+ ${t.addDevice}`}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}