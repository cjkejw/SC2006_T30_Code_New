using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5c9da188-9f33-41f3-a691-27efa28c2cf1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ef748db9-ccf5-4bd3-91ca-0121ba5170fb");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "6898a236-90a3-4555-886f-35ea3c2fa51a", null, "Admin", "ADMIN" },
                    { "fefc0e4e-f4c4-461f-bd02-039a94901ae1", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "6898a236-90a3-4555-886f-35ea3c2fa51a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fefc0e4e-f4c4-461f-bd02-039a94901ae1");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "5c9da188-9f33-41f3-a691-27efa28c2cf1", null, "Admin", "ADMIN" },
                    { "ef748db9-ccf5-4bd3-91ca-0121ba5170fb", null, "User", "USER" }
                });
        }
    }
}
