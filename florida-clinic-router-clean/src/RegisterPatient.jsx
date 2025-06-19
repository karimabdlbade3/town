
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const patients = ["أحمد علي", "محمد حسن", "مريم خالد"];
const doctors = ["د. محمود", "د. عمر", "د. عبد الله"];
const services = ["كشف", "حشو عادي خلفي", "حشو عصب", "خلع", "زراعة"];

export default function RegisterPatient() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    address: "",
    date: new Date().toISOString().split("T")[0],
    patient: "",
    service: "",
    doctor: "",
    total: "",
    paid: "",
    remaining: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    if (name === "total" || name === "paid") {
      const total = parseFloat(updatedForm.total) || 0;
      const paid = parseFloat(updatedForm.paid) || 0;
      updatedForm.remaining = total - paid;
    }
    setForm(updatedForm);
  };

  const handleSelectChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      alert("الاسم ورقم الموبايل مطلوبين");
      return;
    }
    try {
      await addDoc(collection(db, "patients"), form);
      alert("تم حفظ البيانات في Firebase بنجاح");
      setForm({
        name: "",
        age: "",
        phone: "",
        address: "",
        date: new Date().toISOString().split("T")[0],
        patient: "",
        service: "",
        doctor: "",
        total: "",
        paid: "",
        remaining: "",
      });
    } catch (e) {
      console.error("خطأ أثناء الحفظ: ", e);
      alert("حصل خطأ أثناء الحفظ");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <Card className="shadow-xl">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold text-center">تسجيل مريض جديد + خدمة</h2>
          <Input name="name" placeholder="الاسم" value={form.name} onChange={handleChange} required />
          <Input name="age" placeholder="السن" type="number" value={form.age} onChange={handleChange} />
          <Input name="phone" placeholder="رقم الموبايل" value={form.phone} onChange={handleChange} required />
          <Input name="address" placeholder="العنوان" value={form.address} onChange={handleChange} />
          <Input name="date" type="date" value={form.date} readOnly />

          <Select onValueChange={(val) => handleSelectChange("patient", val)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر اسم المريض" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((p, i) => <SelectItem key={i} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select onValueChange={(val) => handleSelectChange("service", val)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الخدمة" />
            </SelectTrigger>
            <SelectContent>
              {services.map((s, i) => <SelectItem key={i} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select onValueChange={(val) => handleSelectChange("doctor", val)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الطبيب" />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((d, i) => <SelectItem key={i} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>

          <Input name="total" placeholder="التوتال" type="number" value={form.total} onChange={handleChange} />
          <Input name="paid" placeholder="المدفوع" type="number" value={form.paid} onChange={handleChange} />
          <Input name="remaining" placeholder="الباقي" type="number" value={form.remaining} readOnly />

          <Button className="w-full" onClick={handleSubmit}>تسجيل</Button>
        </CardContent>
      </Card>
    </div>
  );
}
