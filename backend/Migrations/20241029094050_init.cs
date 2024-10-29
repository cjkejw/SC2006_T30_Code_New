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
                    { "4cf40b23-d3e1-49a3-b6e4-b7f57ff3b4c6", null, "User", "USER" },
                    { "607c2232-d772-4166-b14f-86a595296828", null, "Admin", "ADMIN" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "4cf40b23-d3e1-49a3-b6e4-b7f57ff3b4c6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "607c2232-d772-4166-b14f-86a595296828");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "6898a236-90a3-4555-886f-35ea3c2fa51a", null, "Admin", "ADMIN" },
                    { "fefc0e4e-f4c4-461f-bd02-039a94901ae1", null, "User", "USER" }
                });
        }
    }
}
