import * as fs from "fs";
import * as path from "path";
import { hash } from "./hash";

export class Cache {
  private inMemoryCache: Record<string, string> = {};
  private diskCacheFolderPath: string = "./.cache";
  private diskCacheFileName: string = "cache.json";

  constructor() {
    // Ensure the cache folder exists
    this.ensureCacheFolder();
    // Load existing cache from disk, if any
    this.loadFromDisk();
  }

  private ensureCacheFolder(): void {
    if (!fs.existsSync(this.diskCacheFolderPath)) {
      fs.mkdirSync(this.diskCacheFolderPath);
    }
  }

  private getCacheFilePath(): string {
    return path.join(this.diskCacheFolderPath, this.diskCacheFileName);
  }

  private loadFromDisk(): void {
    const cacheFilePath = this.getCacheFilePath();

    try {
      const data = fs.readFileSync(cacheFilePath, "utf8");
      this.inMemoryCache = JSON.parse(data);
    } catch (error) {
      // Ignore errors (e.g., file not found)
    }
  }

  private saveToDisk(): void {
    const cacheFilePath = this.getCacheFilePath();
    fs.writeFileSync(cacheFilePath, JSON.stringify(this.inMemoryCache), "utf8");
  }

  public getFromCache(id: string): string | undefined {
    return this.inMemoryCache[id];
  }

  public addToCache(id: string, response: string): void {
    this.inMemoryCache[id] = response;
    this.saveToDisk();
  }

  // note: fetch policy is always from cache
  public async getFromCacheOrMakeRequest(
    id: string,
    request: Function
  ): Promise<any> {
    const cachedResponse = this.getFromCache(id);

    if (cachedResponse !== undefined) {
      return cachedResponse;
    } else {
      const newResponse = await request();
      this.addToCache(id, newResponse.toString());
      return newResponse;
    }
  }
}
