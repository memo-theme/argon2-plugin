import { NextRequest, NextResponse } from "next/server";
import client from "../../../lib/mongodb";
import * as argon2 from "argon2";

const DB_NAME = "theme-memories";
const COLLECTION_NAME = "hashed-pwd";

export async function POST(req: NextRequest) {
  try {
    const { slug, plaintext } = await req.json();

    if (!slug || !plaintext) {
      return NextResponse.json(
        { error: "Missing slug or plaintext" },
        { status: 400 },
      );
    }

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const document = await collection.findOne({ slug });

    if (!document) {
      return NextResponse.json({ error: "Slug not found" }, { status: 404 });
    }

    const storedHash = document.hash;

    const isValid = await argon2.verify(storedHash, plaintext);

    return NextResponse.json({ verified: isValid });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
