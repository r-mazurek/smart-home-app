"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const DeviceSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Za krótka nazwa")
        .required("Nazwa wymagana"),
    deviceType: Yup.string()
        .required("Typ wymagany"),
});

interface DeviceFormProps {
    onSubmit: (values: { name: string; deviceType: string }) => void;
}

export default function DeviceForm({ onSubmit }: DeviceFormProps) {
    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Dodaj nowe urządzenie</h3>

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
                                placeholder="Nazwa (np. Lampka nocna)"
                                className="w-full border p-2 rounded text-sm focus:border-blue-500 outline-none"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                        </div>

                        {/* Typ (Dropdown) */}
                        <div>
                            <Field as="select" name="deviceType" className="w-full border p-2 rounded text-sm bg-white">
                                <option value="lightBulb">💡 Żarówka</option>
                                <option value="thermostat">🌡️ Termostat</option>
                                <option value="sensor">📡 Czujnik</option>
                                <option value="outlet">🔌 Gniazdko</option>
                            </Field>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm font-medium transition"
                        >
                            {isSubmitting ? "Dodawanie..." : "+ Dodaj Urządzenie"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}