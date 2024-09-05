"use server";
import { MongoClient, ObjectId } from "mongodb";
import { getIronSession } from "iron-session";
import { sessionOptions,SessionData, defaultSession } from "./lib";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import { cookies } from "next/headers";
import { z } from "zod";
import { serialize } from 'cookie';
import crypto from "crypto";

// connect to mongodb
const client = new MongoClient(process.env.DATABASE_URL);
client.connect()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));
const db = client.db();

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(),sessionOptions);
  if(!session.isLoggedIn){
    session.isLoggedIn = defaultSession.isLoggedIn;
  }
  return session;
}

// Login function
export async function loginUser(prevState, formData) {
  const session = await getSession();

  const schema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const parse = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parse.success) {
    return { message: "Invalid email or password" };
  }

  const { email, password } = parse.data;

  try {
    const user = await db.collection("users").findOne({ email });
    if (!user || !verifyPassword(password, user.password)) {
      return { message: "Invalid email or password" };
    }

    session.ministry = user.ministry;
    session.firstname = user.firstname;
    session.lastname = user.lastname;
    session.bod = user.bod;
    session.contact = user.contact;
    session.nationality = user.nationality;
    session.role = user.role;
    session.identifier = user.identifier;
    session.email = user.email;
    session.isLoggedIn = true;

    await session.save();
    return { 
      user: { name: user.name },
      redirect: '/sitetable'
    };
  } catch (e) {
    console.error(e);
    return { message: "Failed to login" };
  }
}

// logout function
export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}

// used by login funciton to check if passwords match
function verifyPassword(password, hashedPassword) {
  const [salt, hash] = hashedPassword.split(":");
  const newHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  console.log('Password verified:', hash === newHash);
  return hash === newHash;
}

// secure passwords
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

// Retrieving users from db
export async function getUsers() {
  try {
    const users = await db.collection("users").find().toArray();
    const serializedUsers = users.map(user => ({
      ...user,
      _id: user._id.toString()
    }));
    return { users: serializedUsers };
  } catch (e) {
    console.error(e);
    return { message: "Failed to fetch users" };
  }
}

// Retrieving school sites from db
export async function getSchools() {
  try {
    const schools = await db.collection("schools").find().toArray();
    const serializedSchools = schools.map(school => ({
      ...school,
      _id: school._id.toString()
    }));
    return { schools: serializedSchools };
  } catch (e) {
    console.error(e);
    return { message: "Failed to fetch schools" };
  }
}

// Retrieving sites from db
export async function getSites() {
  try {
    const sites = await db.collection("sites").find().toArray();
    const serializedSites = sites.map(site => ({
      ...site,
      _id: site._id.toString()
    }));
    return { sites: serializedSites };
  } catch (e) {
    console.error(e);
    return { message: "Failed to fetch sites" };
  }
}

// Retrieving a site by ID
export async function getSiteById(id) {
  try {
    const site = await db.collection("sites").findOne({ _id: new ObjectId(id) });
    if (site) {
      return { success: true, site: { ...site, _id: site._id.toString() } };
    } else {
      return { success: false, message: "site not found" };
    }
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to fetch site" };
  }
}

// Retrieving a user by ID
export async function getUserById(id) {
  try {
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
    if (user) {
      return { success: true, user: { ...user, _id: user._id.toString() } };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to fetch user" };
  }
}

// Retrieving a school by ID
export async function getSchoolById(id) {
  try {
    const school = await db.collection("schools").findOne({ _id: new ObjectId(id) });
    if (school) {
      return { success: true, school: { ...school, _id: school._id.toString() } };
    } else {
      return { success: false, message: "School not found" };
    }
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to fetch school" };
  }
}

// Create user
export async function createUser(prevState, formData) {
  const schema = z.object({
    ministry: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    role: z.string(),
    password: z.string(),
    dateBirth: z.string(),
    contactNumber: z.string(),
    nationality: z.string(),
    identifier: z.string(),
  });

  const parse = schema.safeParse({
    ministry: formData.get("ministry"),
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password"),
    dateBirth: formData.get("bod"),
    contactNumber: formData.get("contact"),
    nationality: formData.get("nationality"),
    identifier: formData.get("identifier"),
  });

  if (!parse.success) {
    return { message: "Failed to create user" };
  }

  const data = parse.data;
  const ministry = data.ministry;
  const firstname = data.firstname;
  const lastname = data.lastname;
  const email = data.email;
  const role = data.role;
  const password = hashPassword(data.password);
  const bod = data.dateBirth;
  const contact = data.contactNumber;
  const nationality = data.nationality;
  const identifier = data.identifier;

  try {
    console.log(firstname);

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return { message: "Email already registered" };
    }

    const result = await db.collection("users").insertOne({
      ministry,
      firstname,
      lastname,
      email,
      role,
      password,
      bod,
      contact,
      nationality,
      identifier,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    //console.log(result);

    revalidatePath("/add-user");

    return { message: `Added user ${firstname}` };
  } catch (e) {
    console.error(e);
    return { message: "Failed to create user" };
  }
}

// Create school site
export async function createSchool(prevState, formData) {
  const schema = z.object({
    schoolname: z.string(),
    location: z.string(),
    connectivityTechnology: z.string(),
    adslPwVlanid: z.string(),
    wansiteaddress: z.string(),
    adminsubnet: z.string(),
    gdnloopback: z.string(),
    ednloopback: z.string(),
    studentedngatewayaddr: z.string(),
    switchModel: z.string(),
  });

  const parse = schema.safeParse({
    schoolname: formData.get("sitename"),
    location: formData.get("location"),
    connectivityTechnology: formData.get("technology"),
    adslPwVlanid: formData.get("adslPwVLan"),
    wansiteaddress: formData.get("wanAddress"),
    adminsubnet: formData.get("adminSubnet"),
    gdnloopback: formData.get("GDNLoopback"),
    ednloopback: formData.get("EDNLoopback"),
    studentedngatewayaddr: formData.get("EDNGateway"),
    switchModel: formData.get("switchModel"),
  });

  if (!parse.success) {
    return { message: "Failed to create school site" };
  }

  const data = parse.data;
  const { schoolname, location, connectivityTechnology, adslPwVlanid, wansiteaddress, adminsubnet, gdnloopback, ednloopback, studentedngatewayaddr, switchModel } = data;

  try {
    console.log(schoolname);

    const existingUser = await db.collection("users").findOne({ schoolname });
    if (existingUser) {
      return { message: "School site already registered" };
    }

    const result = await db.collection("schools").insertOne({
      schoolname,
      location,
      connectivityTechnology,
      adslPwVlanid,
      wansiteaddress,
      adminsubnet,
      gdnloopback,
      ednloopback,
      studentedngatewayaddr,
      switchModel,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(result);

    revalidatePath("/add-school");

    return { message: `Added site ${schoolname}` };
  } catch (e) {
    console.error(e);
    return { message: "Failed to create school site" };
  }
}

// create sites 
export async function createSite(prevState, formData) {
  const schema = z.object({
    ministry: z.string(),
    department: z.string(),
    sitelocation: z.string(),
    sitename: z.string(),
    nodeAddress: z.string(),
    remoteaddress: z.string(),
    vlanID: z.string(),
    pwNumber: z.string(),
    connectionType: z.string(),
    bandwidth: z.string(),
    routerModel: z.string(),
    routerISO: z.string(),
    routerSerialNumber: z.string(),
    switchModel: z.string(),
    switchISO: z.string(),
    node: z.string(),
    areaNumber: z.string(),
  });

  const parse = schema.safeParse({
    ministry: formData.get("ministry"),
    department: formData.get("department"),
    sitelocation: formData.get("sitelocation"),
    sitename: formData.get("sitename"),
    nodeAddress: formData.get("nodeAddress"),
    remoteaddress: formData.get("remoteaddress"),
    vlanID: formData.get("vlanID"),
    pwNumber: formData.get("pwNumber"),
    connectionType: formData.get("connectionType"),
    bandwidth: formData.get("bandwidth"),
    routerModel: formData.get("routerModel"),
    routerISO: formData.get("routerISO"),
    routerSerialNumber: formData.get("routerSerialNumber"),
    switchModel: formData.get("switchModel"),
    switchISO: formData.get("switchISO"),
    node: formData.get("node"),
    areaNumber: formData.get("areaNumber"),
  });

  if (!parse.success) {
    return { message: "Failed to create site", errors: parse.error.errors };
  }

  const data = parse.data;
  const { ministry, department, sitelocation, sitename, nodeAddress, remoteaddress, vlanID, pwNumber, connectionType, bandwidth, routerModel, routerISO, routerSerialNumber, switchModel, switchISO, node, areaNumber } = data;

  try {
    console.log(sitename);

    const existingSite = await db.collection("sites").findOne({ sitename });
    if (existingSite) {
      return { message: "Site already registered" };
    }

    const result = await db.collection("sites").insertOne({
      ministry, 
      department,
      sitelocation, 
      sitename, 
      nodeAddress, 
      remoteaddress, 
      vlanID, 
      pwNumber, 
      connectionType, 
      bandwidth, 
      routerModel, 
      routerISO, 
      routerSerialNumber, 
      switchModel, 
      switchISO, 
      node, 
      areaNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(result);

    // Revalidate the path if needed
    revalidatePath("/add-site");

    return { message: `Added site ${sitename}` };
  } catch (e) {
    console.error(e);
    return { message: "Failed to create site" };
  }
}

// Update user
export async function updateUser(userData) {
  const schema = z.object({
    _id: z.string(),
    ministry: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    role: z.string(),
    //password: z.string(),
    bod: z.string(),
    contact: z.string(),
    nationality: z.string(),
    identifier: z.string(),
  });

  const parse = schema.safeParse(userData);

  if (!parse.success) {
    return { success: false, message: "Invalid user data" };
  }

  const data = parse.data;
  const userId = new ObjectId(data._id);
  const updatedUser = {
    ministry: data.ministry,
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    role: data.role,
    //password: hashPassword(data.password),
    bod: data.bod,
    contact: data.contact,
    nationality: data.nationality,
    identifier: data.identifier,
    updatedAt: new Date(),
  };

  try {
    const result = await db.collection("users").updateOne({ _id: userId }, { $set: updatedUser });

    if (result.modifiedCount === 1) {
      revalidatePath(`/officers/view-officer?id=${userId}`);
      return { success: true, message: "User updated successfully" };
    } else {
      return { success: false, message: "Failed to update user" };
    }
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to update user" };
  }
}

// Update school
export async function updateSchool(schoolData) {
  const schema = z.object({
    _id: z.string(),
    schoolname: z.string(),
    location: z.string(),
    connectivityTechnology: z.string(),
    adslPwVlanid: z.string(),
    wansiteaddress: z.string(),
    adminsubnet: z.string(),
    gdnloopback: z.string(),
    ednloopback: z.string(),
    studentedngatewayaddr: z.string(),
    switchModel: z.string(),
  });

  const parse = schema.safeParse(schoolData);

  if (!parse.success) {
    return { success: false, message: "Invalid school data" };
  }

  const data = parse.data;
  const schoolId = new ObjectId(data._id);
  const updatedSchool = {
    schoolname: data.schoolname,
    location: data.location,
    connectivityTechnology: data.connectivityTechnology,
    adslPwVlanid: data.adslPwVlanid,
    wansiteaddress: data.wansiteaddress,
    adminsubnet: data.adminsubnet,
    gdnloopback: data.gdnloopback,
    ednloopback: data.ednloopback,
    studentedngatewayaddr: data.studentedngatewayaddr,
    switchModel: data.switchModel,
    updatedAt: new Date(),
  };

  try {
    const result = await db.collection("schools").updateOne({ _id: schoolId }, { $set: updatedSchool });

    if (result.modifiedCount === 1) {
      revalidatePath(`/sitetable/view-school?id=${schoolId}`);
      return { success: true, message: "School updated successfully" };
    } else {
      return { success: false, message: "Failed to update school" };
    }
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to update school" };
  }
}

// Update site
export async function updateSite(siteData) {
  const schema = z.object({
    _id: z.string(),
    ministry: z.string(),
    department: z.string(),
    sitelocation: z.string(),
    sitename: z.string(),
    nodeAddress: z.string(),
    remoteaddress: z.string(),
    vlanID: z.string(),
    pwNumber: z.string(),
    connectionType: z.string(),
    bandwidth: z.string(),
    routerModel: z.string(),
    routerISO: z.string(),
    routerSerialNumber: z.string(),
    switchModel: z.string(),
    switchISO: z.string(),
    node: z.string(),
    areaNumber: z.string(),
  });

  const parse = schema.safeParse(siteData);

  if (!parse.success) {
    return { success: false, message: "Invalid site data" };
  }

  const data = parse.data;
  const siteId = new ObjectId(data._id);
  const updatedSite = {
    ministry: data.ministry,
    department: data.department,
    sitelocation: data.sitelocation,
    sitename: data.sitename,
    nodeAddress: data.nodeAddress,
    remoteaddress: data.remoteaddress,
    vlanID: data.vlanID,
    pwNumber: data.pwNumber,
    connectionType: data.connectionType,
    bandwidth: data.bandwidth,
    routerISO: data.routerISO,
    routerSerialNumber: data.routerSerialNumber,
    switchModel: data.switchModel,
    switchISO: data.switchISO,
    node: data.node,
    areaNumber: data.areaNumber,
    updatedAt: new Date(),
  };

  try {
    const result = await db.collection("sites").updateOne({ _id: siteId }, { $set: updatedSite });

    if (result.modifiedCount === 1) {
      revalidatePath(`/sitetable/view-site?id=${siteId}`);
      return { success: true, message: "Site updated successfully" };
    } else {
      return { success: false, message: "Failed to update site" };
    }
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to update site" };
  }
}

// Delete officer
export async function deleteUser(id) {
  try {
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      revalidatePath("/officers");
      return { success: true, message: "User deleted successfully" };
    } else {
      return { success: false, message: "Failed to delete user" };
    }
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete user" };
  }
}

// Delete school
export async function deleteSchool(id) {
  try {
    const result = await db.collection("schools").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      revalidatePath("/sitetable");
      return { success: true, message: "School deleted successfully" };
    } else {
      return { success: false, message: "Failed to delete school" };
    }
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete school" };
  }
}

// Delete site
export async function deleteSite(id) {
  try {
    const result = await db.collection("sites").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      revalidatePath("/sitetable");
      return { success: true, message: "Site deleted successfully" };
    } else {
      return { success: false, message: "Failed to delete site" };
    }
  } catch (e) {
    console.error(e);
    return { success: false, message: "Failed to delete site" };
  }
}
